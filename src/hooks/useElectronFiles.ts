import { useCallback } from "react";

export function useElectronFiles() {
  const api = window.electronAPI;

  const openReceiptsFolder = useCallback(async () => {
    if (!api) return;
    await api.openReceiptsFolder();
  }, [api]);

  const openExportsFolder = useCallback(async () => {
    if (!api) return;
    await api.openExportsFolder();
  }, [api]);

  /**
   * Open any file with the default OS application.
   * Pass an absolute path OR a relative path inside userData.
   */
  const openFile = useCallback(
    async (filePath: string) => {
      if (!api) return { ok: false, error: "Not running in Electron" };
      return api.openFile(filePath);
    },
    [api],
  );

  //   Print a receipt PDF
  const printReceipt = useCallback(
    async (filePath: string, silent = false) => {
      if (!api) return { ok: false, error: "Not running in Electron" };
      return api.printReceipt(filePath, silent);
    },
    [api],
  );

  //   List all receipt PDFs, newest first
  const listReceipts = useCallback(async () => {
    if (!api) return [];
    return api.listReceipts();
  }, [api]);

  //   List all Excel/CSV exports, newest first
  const listExports = useCallback(async () => {
    if (!api) return [];
    return api.listExports();
  }, [api]);

  return {
    isElectron: !!api,
    openReceiptsFolder,
    openExportsFolder,
    openFile,
    printReceipt,
    listReceipts,
    listExports,
  };
}
