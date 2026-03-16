import { axiosInstance } from "../api/api";


// GET /employees
export const getEmployees = async () => {
  const res = await axiosInstance.get("/employees");
  return res.data;
};

// GET /employees/:name
export const getEmployeeByName = async (name: string) => {
  const res = await axiosInstance.get(`/employees/${encodeURIComponent(name)}`);
  return res.data;
};

// POST /employees  (admin only)
export const createEmployee = async (data: {
  name: string;
  role?: string;
  dateOfBirth?: string;
  commissionRate?: number;
}) => {
  const res = await axiosInstance.post("/employees", data);
  return res.data;
};

// PUT /employees/:id  (admin only)
export const updateEmployee = async (
  id: string,
  data: {
    name?: string;
    role?: string;
    dateOfBirth?: string;
    commissionRate?: number;
  }
) => {
  const res = await axiosInstance.put(`/employees/${id}`, data);
  return res.data;
};

// DELETE /employees/:id  (admin only)
export const deleteEmployee = async (id: string) => {
  const res = await axiosInstance.delete(`/employees/${id}`);
  return res.data;
};