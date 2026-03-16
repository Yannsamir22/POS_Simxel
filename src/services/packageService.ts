import { axiosInstance } from "../api/api";

// GET /packages
export const fetchPackages = async () => {
  const res = await axiosInstance.get("/packages");
  return res.data;
};

// GET /packages/:id
export const getPackageById = async (id: string) => {
  const res = await axiosInstance.get(`/packages/${id}`);
  return res.data;
};

// POST /packages  (admin only)
export const createPackage = async (data: {
  name: string;
  price: number;
  serviceIds: string[];
}) => {
  const res = await axiosInstance.post("/packages", data);
  return res.data;
};

// PUT /packages/:id  (admin only)
export const updatePackage = async (
  id: string,
  data: { name?: string; price?: number; serviceIds?: string[] }
) => {
  const res = await axiosInstance.put(`/packages/${id}`, data);
  return res.data;
};

// DELETE /packages/:id  (admin only)
export const deletePackage = async (id: string) => {
  const res = await axiosInstance.delete(`/packages/${id}`);
  return res.data;
};