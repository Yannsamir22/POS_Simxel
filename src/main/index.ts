import {
  BrowserWindow,
  app,
  dialog,
  ipcMain,
  nativeTheme,
  shell,
} from "electron";
import fs from "fs";
import net from "net";
import path from "path";
import { setupUpdater } from "./update";

const isDev = !app.isPackaged;

const USER_DATA = app.getPath("userData");
const RECEIPTS_DIR = path.join(USER_DATA, "receipts");
const EXPORTS_DIR = path.join(USER_DATA, "exports");
const DB_PATH = path.join(USER_DATA, "simxel.db");

// Cloud url stored as plain text in the userData folder
const CLOUD_URL_FILE = path.join(USER_DATA, "cloud_db_url.txt");

// function readCloudUrl(): string | undefined {
//   try {
//     if (fs.existsSync(CLOUD_URL_FILE)) {
//       const url = fs.readFileSync(CLOUD_URL_FILE, "utf-8").trim();
//       if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
//         return url;
//       }
//     }
//   } catch {
//     // Nocloud Cloud configured
//   }
//   return undefined;
// }

[RECEIPTS_DIR, EXPORTS_DIR].forEach((dir) =>
  fs.mkdirSync(dir, { recursive: true }),
);

//  Port utilities

function isPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => server.close(() => resolve(true)));
    server.listen(port, "127.0.0.1");
  });
}

async function findFreePort(startPort: number): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortFree(port)) return port;
  }
  throw new Error(
    `No free port found between ${startPort} and ${startPort + 19}`,
  );
}

//  Backend

let backendPort = 3000;

async function startBackend(): Promise<void> {
  const entry = path.join(process.resourcesPath, "backend", "server.js");

  if (!fs.existsSync(entry)) {
    dialog.showErrorBox(
      "Simxel - Startup Error",
      `Backend not found at:\n${entry}\n\nPlease reinstall the application.`,
    );
    return;
  }

  const port = await findFreePort(3000);
  backendPort = port;

  if (port !== 3000) {
    console.log(`[Backend] Port 3000 busy - using port ${port}`);
  }

  // Set env vars BEFORE requiring — backend reads them at startup
  process.env.PORT = String(port);
  process.env.DATABASE_URL = `file:${DB_PATH}`;
  process.env.RECEIPTS_DIR = RECEIPTS_DIR;
  process.env.EXPORTS_DIR = EXPORTS_DIR;
  process.env.NODE_ENV = "production";
  process.env.RESOURCES_PATH = process.resourcesPath;

  process.env.JWT_SECRET =
    "22aab455c45eb0beb86192b12c7e5e6b5a21421514cf43ca880925b77bbb9ec3";
  process.env.JWT_EXPIRES_IN = "1d";
  process.env.IS_WEB_VERSION = "false";
  process.env.CLOUD_DATABASE_URL =
    "postgresql://postgres:Rima$22@localhost:5432/simxeldb";

  // if (cloudUrl) {
  //   process.env.CLOUD_DATABASE_URL = cloudUrl;
  //   console.log("[Backend] Cloud database URL loaded from config file");
  // } else {
  //   console.log("[Backend] No cloud_db_url.txt found — sync disabled");
  //   // do not set CLOUD_DATABASE_URL — the backend will detect its absence
  //   // and skip all cloud sync operations cleanly
  //   delete process.env.CLOUD_DATABASE_URL;
  // }

  try {
    require(entry);
    console.log(`[Backend] Running in-process on port ${port}`);
  } catch (err: any) {
    console.error("[Backend] Failed to load:", err.message);
    dialog.showErrorBox(
      "Simxel - Backend Error",
      `Failed to start the backend.\n\n${err.message}`,
    );
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
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
    mainWindow.webContents.on("did-finish-load", () => {
      mainWindow?.webContents.executeJavaScript(
        `window.__BACKEND_PORT__ = ${backendPort};`,
      );
    });
  }

  mainWindow.once("ready-to-show", () => mainWindow?.show());
  mainWindow.on("closed", () => (mainWindow = null));
}

//  IPC Handlers

ipcMain.handle("get-receipts-dir", () => RECEIPTS_DIR);
ipcMain.handle("get-exports-dir", () => EXPORTS_DIR);
ipcMain.handle("open-receipts-folder", () => shell.openPath(RECEIPTS_DIR));
ipcMain.handle("open-exports-folder", () => shell.openPath(EXPORTS_DIR));
ipcMain.handle("get-backend-port", () => backendPort);

// IPC for cloud url
ipcMain.handle("set-cloud-url", async (_event, url: string) => {
  try {
    if (
      !url ||
      (!url.startsWith("postgresql://") && !url.startsWith("postgres://"))
    ) {
      return { ok: false, error: "Invalid PostgreSQL URL" };
    }
    fs.writeFileSync(CLOUD_URL_FILE, url.trim(), "utf-8");
    process.env.CLOUD_DATABASE_URL = url.trim();
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
});
const CLOUD_URL = "postgresql://postgres:Rima$22@localhost:5432/simxeldb";

ipcMain.handle("get-cloud-url", () => CLOUD_URL);
ipcMain.handle(
  "save-and-open-file",
  async (
    _event,
    { fileName, base64 }: { fileName: string; base64: string },
  ) => {
    try {
      const filePath = path.join(EXPORTS_DIR, fileName);
      fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
      const err = await shell.openPath(filePath);
      return err ? { ok: false, error: err } : { ok: true, filePath };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? "Failed to save file" };
    }
  },
);

ipcMain.handle("open-file", async (_event, filePath: string) => {
  const candidates: string[] = path.isAbsolute(filePath)
    ? [filePath]
    : [
        path.join(USER_DATA, filePath),
        path.join(EXPORTS_DIR, filePath),
        path.join(RECEIPTS_DIR, filePath),
      ];
  const resolved = candidates.find((p) => fs.existsSync(p));
  if (!resolved) {
    return { ok: false, error: `File not found: ${filePath}` };
  }
  const err = await shell.openPath(resolved);
  return err ? { ok: false, error: err } : { ok: true };
});

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
              resolve({
                ok: true,
                error: `Printer: ${reason} - opened in viewer`,
              });
            }
          },
        );
      });
      printWin.webContents.once("did-fail-load", () => {
        printWin.close();
        shell.openPath(resolved);
        resolve({ ok: true, error: "Could not load PDF - opened in viewer" });
      });
    });
  },
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

//  App Lifecycle ─

app.whenReady().then(async () => {
  if (!isDev) {
    await startBackend();
    await new Promise<void>((r) => setTimeout(r, 1500));
  }

  createWindow();

  if (!isDev) setupUpdater(mainWindow!);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
