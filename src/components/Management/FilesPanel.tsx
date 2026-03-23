import {
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Loader2,
  Printer,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useElectronFiles } from "../../hooks/useElectronFiles";
import { useT } from "../../hooks/useT";
import { useToastStore } from "../../stores/toastStore";

interface FileInfo {
  name: string;
  path: string;
  mtime: Date;
}

type Tab = "receipts" | "exports";

export default function FilesPanel() {
  const {
    isElectron,
    listReceipts,
    listExports,
    openFile,
    printReceipt,
    openReceiptsFolder,
    openExportsFolder,
  } = useElectronFiles();

  const addToast = useToastStore((s: any) => s.addToast);
  const { t } = useT();

  const [tab, setTab] = useState<Tab>("receipts");
  const [receipts, setReceipts] = useState<FileInfo[]>([]);
  const [exports, setExports] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const [r, e] = await Promise.all([listReceipts(), listExports()]);
      setReceipts(r as FileInfo[]);
      setExports(e as FileInfo[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isElectron) refresh();
  }, [isElectron]);

  if (!isElectron) {
    return (
      <div className="p-6 text-base-content/50 text-sm">
        {t("files.desktopOnly")}
      </div>
    );
  }

  const files = tab === "receipts" ? receipts : exports;

  const handleOpen = async (file: FileInfo) => {
    setActionId(file.name + "-open");
    const result = await openFile(file.path);
    if (!result.ok) addToast(t("files.openError"), "error");
    setActionId(null);
  };

  const handlePrint = async (file: FileInfo) => {
    setActionId(file.name + "-print");
    const result = await printReceipt(file.path, false);
    if (!result.ok) addToast(t("files.printError"), "error");
    else addToast(t("files.printSuccess"), "success");
    setActionId(null);
  };

  const formatDate = (d: Date) =>
    new Date(d).toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{t("files.savedFiles")}</h2>

        <div className="flex gap-2">
          <button
            onClick={refresh}
            className="btn btn-ghost btn-sm gap-1.5"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {t("files.refresh")}
          </button>

          <button
            onClick={
              tab === "receipts" ? openReceiptsFolder : openExportsFolder
            }
            className="btn btn-ghost btn-sm gap-1.5"
          >
            <FolderOpen size={14} />
            {t("files.openFolder")}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed w-fit">
        <button
          role="tab"
          className={`tab gap-1.5 ${tab === "receipts" ? "tab-active" : ""}`}
          onClick={() => setTab("receipts")}
        >
          <FileText size={14} />
          {t("files.receipts")}
          {receipts.length > 0 && (
            <span className="badge badge-xs badge-primary">
              {receipts.length}
            </span>
          )}
        </button>

        <button
          role="tab"
          className={`tab gap-1.5 ${tab === "exports" ? "tab-active" : ""}`}
          onClick={() => setTab("exports")}
        >
          <FileSpreadsheet size={14} />
          {t("files.exports")}
          {exports.length > 0 && (
            <span className="badge badge-xs badge-secondary">
              {exports.length}
            </span>
          )}
        </button>
      </div>

      {/* File list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={28} className="animate-spin text-base-content/30" />
        </div>
      ) : files.length === 0 ? (
        <div className="py-12 text-center text-base-content/40 text-sm">
          {tab === "receipts" ? t("files.noReceipts") : t("files.noExports")}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300">
          <table className="table table-sm w-full">
            <thead>
              <tr>
                <th>{t("common.name")}</th>
                <th>{t("common.date")}</th>
                <th className="text-right">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => {
                const openKey = file.name + "-open";
                const printKey = file.name + "-print";

                return (
                  <tr key={file.path} className="hover">
                    <td className="font-mono text-xs max-w-xs truncate">
                      {file.name}
                    </td>
                    <td className="text-xs text-base-content/60 whitespace-nowrap">
                      {formatDate(file.mtime)}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleOpen(file)}
                          disabled={!!actionId}
                          className="btn btn-ghost btn-xs gap-1"
                          title={t("files.open")}
                        >
                          {actionId === openKey ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <FolderOpen size={12} />
                          )}
                          {t("files.open")}
                        </button>

                        {tab === "receipts" && (
                          <button
                            onClick={() => handlePrint(file)}
                            disabled={!!actionId}
                            className="btn btn-ghost btn-xs gap-1"
                            title={t("files.print")}
                          >
                            {actionId === printKey ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Printer size={12} />
                            )}
                            {t("files.print")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
