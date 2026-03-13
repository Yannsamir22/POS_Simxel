import { axiosInstance } from "../api/api";
import type { Ticket } from "../stores/useTicketStore";


// Sales logic
export const SalesService = {

      createSale: async (payload: { items: { id: string; type: string; quantity: number; employeeId?: string }[]; payments: { method: string; amount: number }[] }) => {
            try{
                  const res = await axiosInstance.post("/sales", payload);
                  console.log(res)
                  return res.data
            } catch(error: any) {
                  console.error("Error creating sale: ", error.response?.data || error.message)
                  throw error
            }
      },

      getSales: async () => {
    try {
      const res = await axiosInstance.get("/sales");
      return res.data;
    } catch (error: any) {
      console.error("Error fetching sales:", error.response?.data || error.message);
      throw error;
    }
  },
}

