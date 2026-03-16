import { axiosInstance } from "../api/api";

// GET /products
export const fetchProducts = async () => {
  const res = await axiosInstance.get("/products");
  return res.data;
};

// GET /products/:id
export const fetchProductById = async (id: string) => {
  const res = await axiosInstance.get(`/products/${id}`);
  return res.data;
};

// POST /products
export const createProduct = async (data: {
  name: string;
  salePrice: number;
  unitCost?: number;
  stock?: number;
}) => {
  const res = await axiosInstance.post("/products", data);
  return res.data;
};

// PUT /products/:id
export const updateProduct = async (
  id: string,
  data: {
    name?: string;
    salePrice?: number;
    unitCost?: number;
    stock?: number;
  }
) => {
  const res = await axiosInstance.put(`/products/${id}`, data);
  return res.data;
};

// DELETE /products/:id
export const deleteProduct = async (id: string) => {
  const res = await axiosInstance.delete(`/products/${id}`);
  return res.data;
};

// PATCH /products/:id/stock  
export const adjustProductStock = async (id: string, quantity: number) => {
  const res = await axiosInstance.patch(`/products/${id}/stock`, { quantity });
  return res.data;
};

// GET /products/stats/inventory-value
export const fetchInventoryStats = async () => {
  const res = await axiosInstance.get("/products/stats/inventory-value");
  return res.data;
};