import { axiosInstance } from "../api/api";

declare global {
  interface Window {
    electronAPI?: {
      openFile: (
        fileName: string,
      ) => Promise<{ ok: boolean; error?: string; path?: string }>;
    };
  }
}

/**
 * Downloads a report as a blob, saves it via the backend (already done),
 * and opens it automatically in Electron via window.electronAPI.
 *
 * In web mode it falls back to a classic browser download.
 */
async function handleReportDownload(
  request: Promise<any>,
  fallbackFileName: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await request;

    //  Get filename from Content-Disposition header 
    const disposition: string = res.headers?.["content-disposition"] ?? "";
    const match = disposition.match(/filename[^;=\n]*=(['"]?)([^'"\n]*)\1/);
    const fileName = match?.[2]?.trim() ?? fallbackFileName;

    //  Electron: open the file that was already saved by the backend 
    if (window.electronAPI) {
      const result = await window.electronAPI.openFile(fileName);
      if (!result.ok) {
        // File not found in EXPORTS_DIR — fall back to browser download
        console.warn(
          `[ReportService] openFile("${fileName}") failed: ${result.error}. Falling back to download.`,
        );
        triggerBrowserDownload(res.data, fileName);
      }
      return { ok: true };
    }

    //  Web fallback: trigger browser download 
    triggerBrowserDownload(res.data, fileName);
    return { ok: true };
  } catch (err: any) {
    const error =
      err.response?.data?.error ??
      err.message ??
      "Failed to generate report";
    console.error("[ReportService]", error);
    return { ok: false, error };
  }
}


/** Reads the actual error message even when the response is a Blob. */
async function extractError(err: any, fallback: string): Promise<string> {
  try {
    const blob: Blob | undefined = err?.response?.data;
    if (blob instanceof Blob) {
      const text = await blob.text();
      const json = JSON.parse(text);
      return json?.error ?? json?.message ?? fallback;
    }
    return (
      err?.response?.data?.error ??
      err?.message ??
      fallback
    );
  } catch {
    return err?.message ?? fallback;
  }
}

function triggerBrowserDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

//  Shared config for all report requests ─
const BLOB_CONFIG = {
  responseType: "blob" as const, // ← critical: tells axios not to parse as JSON
};

export const ReportService = {
  /**
   * Sales Journal — full transaction list
   */
  exportSalesJournal: (startDate: string, endDate: string) =>
    handleReportDownload(
      axiosInstance.get("/reports/export/sales-journal", {
        params: { startDate, endDate },
        ...BLOB_CONFIG,
      }),
      `Journal_Ventes_${startDate}_to_${endDate}.xlsx`,
    ),

  /**
   * Staff Performance — commissions & revenue per employee
   */
  exportStaffPerformance: (startDate: string, endDate: string) =>
    handleReportDownload(
      axiosInstance.get("/reports/export/staff-performance", {
        params: { startDate, endDate },
        ...BLOB_CONFIG,
      }),
      `Rapport_Staff_${startDate}_to_${endDate}.xlsx`,
    ),

  /**
   * Stock Status — current inventory snapshot
   */
  exportStockStatus: () =>
    handleReportDownload(
      axiosInstance.get("/reports/export/stock-status", BLOB_CONFIG),
      `Rapport_Stocks_${new Date().toISOString().split("T")[0]}.xlsx`,
    ),

  /**
   * Financial Balance — revenue vs expenses
   */
  exportFinancialBalance: (startDate: string, endDate: string) =>
    handleReportDownload(
      axiosInstance.get("/reports/export/financial-balance", {
        params: { startDate, endDate },
        ...BLOB_CONFIG,
      }),
      `Bilan_Financier_${startDate}_to_${endDate}.xlsx`,
    ),

  /**
   * Sales Summary — totals + payment breakdown (JSON, no file)
   */
  getSalesSummary: async (startDate: string, endDate: string) => {
    const res = await axiosInstance.get("/reports/summary", {
      params: { startDate, endDate },
    });
    return res.data;
  },

  /**
   * Top Items — best selling products/services (JSON, no file)
   */
  getTopItems: async (startDate: string, endDate: string, limit = 10) => {
    const res = await axiosInstance.get("/reports/top-items", {
      params: { startDate, endDate, limit },
    });
    return res.data;
  },
};