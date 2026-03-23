export interface Filenfo {
  name: string;
  path: string;
  mtime: Date;
}

export interface ElectronAPI {
  // Directories
  getReceiptsDir: () => Promise<string>;
  getExportsDir: () => Promise<string>;
  openReceiptsFolder: () => Promise<void>;
  openExportsFolder: () => Promise<void>;

  // File operations
  openFile: (filePath: string) => Promise<{ ok: boolean; error?: string }>;
  listReceipts: () => Promise<Filenfo[]>;
  listExports: () => Promise<Filenfo[]>;

  //   Printing
  printReceipt: (
    filePath: string,
    silent?: boolean,
  ) => Promise<{ ok: boolean; error?: string }>;

  // App info
  getAppVersion: () => Promise<string>;
  getBackendPort: () => Promise<number>;

  // Cloud DB URL
  setCloudUrl: (url: string) => Promise<{ ok: boolean; error?: string }>;
  getCloudUrl: () => Promise<string | null>;

  // Auto-updater
  onUpdateAvailable: (cb: (info: { version: string }) => void) => () => void;
  onUpdateDownloaded: (cb: (info: { version: string }) => void) => () => void;
  onUpdateProgress: (cb: (progress: { percent: number }) => void) => () => void;

  installUpdate: () => void;
  checkForUpdates: () => void;
}

declare global {
  interface Window {
    // Available only running inside electron
    electronAPI?: ElectronAPI;

    __BACKEND_PORT__?: number;
  }
}

export { };

