// Handles auto-updates using electron-updater.
// Publishing: Configure the GitHub repo in electron-builder.yml under the `publish` key.

import { BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";

export function setupUpdater(win: BrowserWindow): void {
  // Configuration

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  // Events
  autoUpdater.on("checking-for-update", () => {
    console.log("[Update] Checking for updates...");
  });

  autoUpdater.on("update-available", (info) => {
    console.log(`[Updater] Update available: ${info.version}`);
    win.webContents.send("update-available", { version: info.version });
  });

  autoUpdater.on("update-not-available", () => {
    console.log("[Updater] App is up to date.");
  });

  autoUpdater.on("download-progress", (progress) => {
    const pct = Math.round(progress.percent);
    console.log(`[Updater] Downloading... ${pct}%`);
    win.webContents.send("update-download-progress", { percent: pct });
  });

  autoUpdater.on("update-downloaded", (info) => {
    console.log(`[Updater] Update ${info.version} download - ready to install`);
    win.webContents.send("update-downloaded", { version: info.version });
  });

  autoUpdater.on("error", (error) => {
    console.error("[Updater] Error: ", error?.message ?? error);
  });

  //   IPC from renderer

  // Renderer clicked "Restart & Update"
  ipcMain.on("install-update", () => {
    autoUpdater.quitAndInstall(
      false, // isSilent - show installer dialog on Windows
      true, // isForceRunAfter - relaunch after install
    );
  });

  // Rederer asked to manually check
  ipcMain.on("check-for-updates", () => {
    autoUpdater.checkForUpdates().catch((error) => {
      console.error("[Updater] Manual check failed: ", error?.message);
    });
  });

  // Initial check
  setTimeout(() => {
    autoUpdater
      .checkForUpdates()
      .catch((error) =>
        console.error("[Updater] Initial check failed: ", error?.message),
      );
  }, 10_000); // 10s after launch
}
