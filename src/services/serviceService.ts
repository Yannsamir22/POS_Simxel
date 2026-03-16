import { axiosInstance } from "../api/api";

// GET /services
export const fetchServices = async () => {
  const res = await axiosInstance.get("/services");
  // Backend returns { ok: true, data: Service[] }
  return res.data;
};

// GET /services/:id
export const getServiceById = async (id: string) => {
  const res = await axiosInstance.get(`/services/${id}`);
  return res.data;
};

// POST /services  (admin only)
export const createService = async (data: { name: string; price: number }) => {
  const res = await axiosInstance.post("/services", data);
  return res.data;
};

// PUT /services/:id  (admin only)
export const updateService = async (
  id: string,
  data: { name?: string; price?: number }
) => {
  const res = await axiosInstance.put(`/services/${id}`, data);
  return res.data;
};

// DELETE /services/:id  (admin only)
export const deleteService = async (id: string) => {
  const res = await axiosInstance.delete(`/services/${id}`);
  return res.data;
};