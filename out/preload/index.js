"use strict";
const electron = require("electron");
function on(channel, cb) {
  const listener = (_, payload) => cb(payload);
  electron.ipcRenderer.on(channel, listener);
  return () => electron.ipcRenderer.off(channel, listener);
}
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // Directories
  getReceiptsDir: () => electron.ipcRenderer.invoke("get-receipts-dir"),
  getExportsDir: () => electron.ipcRenderer.invoke("get-exports-dir"),
  openReceiptsFolder: () => electron.ipcRenderer.invoke("open-receipts-folder"),
  openExportsFolder: () => electron.ipcRenderer.invoke("open-exports-folder"),
  // Files
  openFile: (filePath) => electron.ipcRenderer.invoke("open-file", filePath),
  listReceipts: () => electron.ipcRenderer.invoke("list-receipts"),
  listExports: () => electron.ipcRenderer.invoke("list-exports"),
  // Printing
  printReceipt: (filePath, silent = false) => electron.ipcRenderer.invoke("print-receipt", filePath, silent),
  // App info
  getAppVersion: () => electron.ipcRenderer.invoke("get-app-version"),
  // Auto-updater — push events from main → renderer
  onUpdateAvailable: (cb) => on("update-available", cb),
  onUpdateDownloaded: (cb) => on("update-downloaded", cb),
  onUpdateProgress: (cb) => on("update-download-progress", cb),
  installUpdate: () => electron.ipcRenderer.send("install-update"),
  checkForUpdates: () => electron.ipcRenderer.send("check-for-updates")
});
