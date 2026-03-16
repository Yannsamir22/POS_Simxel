import { axiosInstance } from "../api/api";

// GET /reports/summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
export const getSalesSummary = async (startDate: string, endDate: string) => {
  const res = await axiosInstance.get("/reports/summary", {
    params: { startDate, endDate },
  });
  return res.data;
};

// GET /reports/top-items?startDate=...&endDate=...&limit=...
export const getTopItems = async (
  startDate: string,
  endDate: string,
  limit: number = 10,
) => {
  const res = await axiosInstance.get("/reports/top-items", {
    params: { startDate, endDate, limit },
  });
  return res.data;
};

// GET /reports/export/sales-journal  — downloads Excel file
export const downloadSalesJournal = async (
  startDate: string,
  endDate: string,
) => {
  const res = await axiosInstance.get("/reports/export/sales-journal", {
    params: { startDate, endDate },
    responseType: "blob", // important: file download
  });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = `Journal_Ventes_${startDate}_${endDate}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// GET /reports/export/staff-performance
export const downloadStaffPerformance = async (
  startDate: string,
  endDate: string,
) => {
  const res = await axiosInstance.get("/reports/export/staff-performance", {
    params: { startDate, endDate },
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = `Staff_Performance_${startDate}_${endDate}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// GET /reports/export/stock-status
export const downloadStockStatus = async () => {
  const res = await axiosInstance.get("/reports/export/stock-status", {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = `Stock_Status.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// GET /reports/export/financial-balance
export const downloadFinancialBalance = async (
  startDate: string,
  endDate: string,
) => {
  const res = await axiosInstance.get("/reports/export/financial-balance", {
    params: { startDate, endDate },
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = `Financial_Balance_${startDate}_${endDate}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};
