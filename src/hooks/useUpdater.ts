//  Connects the React app to Electron's auto-updater IPC events.
//  Returns state that drives an update notification banner.

import { useCallback, useEffect, useState } from "react";

interface UpdaterState {
  /** A new version has been found and is downloading / ready */
  updateAvailable: boolean;
  /** Download complete – safe to install */
  updateReady: boolean;
  /** Semver string of the incoming release */
  version: string | null;
  /** 0-100 download progress; null while not downloading */
  progress: number | null;
  /** True when running inside Electron */
  isElectron: boolean;
  /** Quit + install the downloaded update */
  install: () => void;
  /** Manually trigger an update check */
  checkNow: () => void;
}

export function useUpdater(): UpdaterState {
  const api = window.electronAPI;
  const isElectron = !!api;
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const [version, setVersion] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!api) return;

    // Subscribe and collect unsubscribe functions
    const unsubs = [
      api.onUpdateAvailable(({ version: v }) => {
        setUpdateAvailable(true);
        setVersion(v);
      }),
      api.onUpdateDownloaded(({ version: v }) => {
        setUpdateReady(true);
        setVersion(v);
        setProgress(null);
      }),

      api.onUpdateProgress(({ percent }) => {
        setProgress(percent);
      }),
    ];
    return () => unsubs.forEach((fn) => fn());
  }, [api]);

  const install = useCallback(() => {
    api?.installUpdate();
  }, [api]);

  const checkNow = useCallback(() => {
    api?.checkForUpdates();
  }, [api]);

  return {
    updateAvailable,
    updateReady,
    version,
    progress,
    isElectron,
    install,
    checkNow,
  };
}
