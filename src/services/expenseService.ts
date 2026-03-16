import { axiosInstance } from "../api/api";

// GET /expenses
export const fetchExpenses = async () => {
  const res = await axiosInstance.get("/expenses");
  return res.data;
};
 
// POST /expenses  
export const createExpense = async (data: {
  type: string;
  amount: number;
  note?: string;
  date?: string;
}) => {
  const res = await axiosInstance.post("/expenses", data);
  return res.data;
};
 
// PUT /expenses/:id  (admin only)
export const updateExpense = async (
  id: string,
  data: { type?: string; amount?: number; note?: string; date?: string }
) => {
  const res = await axiosInstance.put(`/expenses/${id}`, data);
  return res.data;
};
 
// DELETE /expenses/:id  (admin only)
export const deleteExpense = async (id: string) => {
  const res = await axiosInstance.delete(`/expenses/${id}`);
  return res.data;
};