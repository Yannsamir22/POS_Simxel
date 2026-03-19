/**
 * electron/preload/index.ts
 *
 * This script runs in an isolated context before the renderer.
 * It uses contextBridge to safely expose a typed API (window.electronAPI)
 * to the React app without leaking Node / Electron internals.
 */
import { contextBridge, ipcRenderer } from "electron";

// ─── Type definitions (also exported for src/types) ───────────────────────────
export interface FileInfo {
  name: string;
  path: string;
  mtime: Date;
}

export interface ElectronAPI {
  // ── Directories ──────────────────────────────────────────────────────────
  getReceiptsDir: () => Promise<string>;
  getExportsDir: () => Promise<string>;
  openReceiptsFolder: () => Promise<void>;
  openExportsFolder: () => Promise<void>;

  // ── File operations ───────────────────────────────────────────────────────
  openFile: (filePath: string) => Promise<{ ok: boolean; error?: string }>;
  listReceipts: () => Promise<FileInfo[]>;
  listExports: () => Promise<FileInfo[]>;

  // ── Printing ─────────────────────────────────────────────────────────────
  printReceipt: (
    filePath: string,
    silent?: boolean
  ) => Promise<{ ok: boolean; error?: string }>;

  // ── App info ─────────────────────────────────────────────────────────────
  getAppVersion: () => Promise<string>;

  // ── Auto-updater ─────────────────────────────────────────────────────────
  onUpdateAvailable: (cb: (info: { version: string }) => void) => () => void;
  onUpdateDownloaded: (cb: (info: { version: string }) => void) => () => void;
  onUpdateProgress: (cb: (progress: { percent: number }) => void) => () => void;
  installUpdate: () => void;
  checkForUpdates: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
/**
 * Subscribe to an IPC event and return an unsubscribe function.
 * This pattern avoids listener leaks in React's useEffect.
 */
function on<T>(channel: string, cb: (payload: T) => void): () => void {
  const listener = (_: Electron.IpcRendererEvent, payload: T) => cb(payload);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.off(channel, listener);
}

// ─── Expose API ───────────────────────────────────────────────────────────────
contextBridge.exposeInMainWorld("electronAPI", {
  // Directories
  getReceiptsDir: () => ipcRenderer.invoke("get-receipts-dir"),
  getExportsDir: () => ipcRenderer.invoke("get-exports-dir"),
  openReceiptsFolder: () => ipcRenderer.invoke("open-receipts-folder"),
  openExportsFolder: () => ipcRenderer.invoke("open-exports-folder"),

  // Files
  openFile: (filePath: string) => ipcRenderer.invoke("open-file", filePath),
  listReceipts: () => ipcRenderer.invoke("list-receipts"),
  listExports: () => ipcRenderer.invoke("list-exports"),

  // Printing
  printReceipt: (filePath: string, silent = false) =>
    ipcRenderer.invoke("print-receipt", filePath, silent),

  // App info
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),

  // Auto-updater — push events from main → renderer
  onUpdateAvailable: (cb) => on("update-available", cb),
  onUpdateDownloaded: (cb) => on("update-downloaded", cb),
  onUpdateProgress: (cb) => on("update-download-progress", cb),
  installUpdate: () => ipcRenderer.send("install-update"),
  checkForUpdates: () => ipcRenderer.send("check-for-updates"),
} satisfies ElectronAPI);