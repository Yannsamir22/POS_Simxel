import { ChildProcess, spawn } from "child_process";
import {
  BrowserWindow,
  app,
  ipcMain,
  nativeTheme,
  shell,
} from "electron";
import fs from "fs";
import path from "path";
import { setupUpdater } from "./update";

//  Paths 
const isDev = !app.isPackaged;

/**
 * User-data folder lives in:
 *   Windows: %APPDATA%\Simxel
 *   macOS:   ~/Library/Application Support/Simxel
 *   Linux:   ~/.config/Simxel
 */
const USER_DATA = app.getPath("userData");
const RECEIPTS_DIR = path.join(USER_DATA, "receipts");
const EXPORTS_DIR = path.join(USER_DATA, "exports");
const DB_PATH = path.join(USER_DATA, "simxel.db");

// Ensure output folders exist before anything else runs
[RECEIPTS_DIR, EXPORTS_DIR].forEach((dir) =>
  fs.mkdirSync(dir, { recursive: true })
);

//  Backend process 
let backendProcess: ChildProcess | null = null;

function getBackendEntry(): string {
  if (isDev) {
    return path.resolve(__dirname, "../../../../Simxel/dist/server.js");
  }
  return path.join(process.resourcesPath, "backend", "server.js");
}

function startBackend(): void {
  const entry = getBackendEntry();

  if (!fs.existsSync(entry)) {
    console.error(`[Electron] Backend not found at: ${entry}`);
    if (!isDev) {
      const { dialog } = require("electron");
      dialog.showErrorBox(
        "Simxel – Startup Error",
        `Backend server not found.\nExpected: ${entry}\n\nPlease reinstall the application.`
      );
    }
    return;
  }

  backendProcess = spawn(process.execPath, [entry], {
    env: {
      ...process.env,
      NODE_ENV: isDev ? "development" : "production",
      PORT: "3000",
      DATABASE_URL: `file:${DB_PATH}`,
      RECEIPTS_DIR,
      EXPORTS_DIR,
    },
    stdio: isDev ? "inherit" : "pipe",
  });

  backendProcess.on("error", (err) =>
    console.error("[Backend] Process error:", err)
  );
  backendProcess.on("exit", (code, signal) =>
    console.log(`[Backend] Exited — code=${code} signal=${signal}`)
  );

  console.log(`[Backend] Started — PID ${backendProcess.pid}`);
}

function stopBackend(): void {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill();
    backendProcess = null;
  }
}

//  Window 
let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    title: "Simxel POS",
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#1d232a" : "#ffffff",
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../dist/index.html"));
  }

  mainWindow.once("ready-to-show", () => mainWindow?.show());
  mainWindow.on("closed", () => (mainWindow = null));
}

//  IPC Handlers 

ipcMain.handle("get-receipts-dir", () => RECEIPTS_DIR);
ipcMain.handle("get-exports-dir", () => EXPORTS_DIR);
ipcMain.handle("open-receipts-folder", () => shell.openPath(RECEIPTS_DIR));
ipcMain.handle("open-exports-folder", () => shell.openPath(EXPORTS_DIR));

/**
 * Open a file with the default OS app.
 * Accepts an absolute path OR just a filename.
 * Search order: absolute → USER_DATA → EXPORTS_DIR → RECEIPTS_DIR
 */
ipcMain.handle("open-file", async (_event, filePath: string) => {
  const candidates: string[] = [];

  if (path.isAbsolute(filePath)) {
    candidates.push(filePath);
  } else {
    candidates.push(
      path.join(USER_DATA,    filePath),
      path.join(EXPORTS_DIR,  filePath),
      path.join(RECEIPTS_DIR, filePath),
    );
  }

  const resolved = candidates.find((p) => fs.existsSync(p));

  if (!resolved) {
    return {
      ok: false,
      error: `File not found: ${filePath}\nLooked in:\n${candidates.join("\n")}`,
    };
  }

  const err = await shell.openPath(resolved);
  return err ? { ok: false, error: err } : { ok: true };
});

/**
 * Print a receipt PDF using a hidden BrowserWindow.
 * Falls back to OS viewer if printer is unavailable.
 */
ipcMain.handle(
  "print-receipt",
  async (_event, filePath: string, silent = false) => {
    const resolved = path.isAbsolute(filePath)
      ? filePath
      : path.join(RECEIPTS_DIR, filePath);

    if (!fs.existsSync(resolved)) {
      return { ok: false, error: `Receipt not found: ${resolved}` };
    }

    return new Promise<{ ok: boolean; error?: string }>((resolve) => {
      const printWin = new BrowserWindow({
        show: false,
        webPreferences: { nodeIntegration: false },
      });

      printWin.loadURL(`file://${resolved}`);

      printWin.webContents.once("did-finish-load", () => {
        printWin.webContents.print(
          { silent, printBackground: true, color: true },
          (success, reason) => {
            printWin.close();
            if (success) {
              resolve({ ok: true });
            } else {
              shell.openPath(resolved);
              resolve({ ok: true, error: `Printer: ${reason} – opened in viewer` });
            }
          }
        );
      });

      printWin.webContents.once("did-fail-load", () => {
        printWin.close();
        shell.openPath(resolved);
        resolve({ ok: true, error: "Could not load PDF – opened in viewer" });
      });
    });
  }
);

ipcMain.handle("list-receipts", () => {
  try {
    return fs
      .readdirSync(RECEIPTS_DIR)
      .filter((f) => f.endsWith(".pdf"))
      .map((f) => ({
        name: f,
        path: path.join(RECEIPTS_DIR, f),
        mtime: fs.statSync(path.join(RECEIPTS_DIR, f)).mtime,
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  } catch {
    return [];
  }
});

ipcMain.handle("list-exports", () => {
  try {
    return fs
      .readdirSync(EXPORTS_DIR)
      .filter((f) => f.match(/\.(xlsx|csv)$/i))
      .map((f) => ({
        name: f,
        path: path.join(EXPORTS_DIR, f),
        mtime: fs.statSync(path.join(EXPORTS_DIR, f)).mtime,
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  } catch {
    return [];
  }
});

ipcMain.handle("get-app-version", () => app.getVersion());

//  App Lifecycle 
app.whenReady().then(async () => {
  if (!isDev) {
    startBackend();
    await new Promise<void>((r) => setTimeout(r, 1500));
  }

  createWindow();

  if (!isDev) {
    setupUpdater(mainWindow!);
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  stopBackend();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => stopBackend());