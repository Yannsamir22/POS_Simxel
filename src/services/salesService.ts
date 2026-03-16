import { axiosInstance } from "../api/api";

export const SalesService = {
  // POST /sales  — create a new sale
  createSale: async (payload: {
    items: {
      id: string;
      type: string;
      quantity: number;
      employeeId?: string;
    }[];
    payments: { method: string; amount: number }[];
    saleDate?: string;
  }) => {
    const res = await axiosInstance.post("/sales", payload);
    // Only open the receipt URL if one is actually returned
    if (res.data?.receipt) {
      window.open(res.data.receipt);
    }
    return res.data;
  },

  // GET /sales  (admin only)
  getSales: async () => {
    const res = await axiosInstance.get("/sales");
    return res.data;
  },

  // GET /sales/:id  (admin only)
  getSaleById: async (id: string) => {
    const res = await axiosInstance.get(`/sales/${id}`);
    return res.data;
  },

  // GET /sales/date/:year  (admin only)
  getSalesByYear: async (year: number) => {
    const res = await axiosInstance.get(`/sales/date/${year}`);
    return res.data;
  },

  // GET /sales/stats/dashboard  (admin only)
  getDashboardStats: async (period: string) => {
    const res = await axiosInstance.get("/sales/stats/dashboard", {
      params: { period },
    });
    return res.data;
  },
};