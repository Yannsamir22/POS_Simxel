import { axiosInstance } from "../api/api";

export const getProducts = async () => {
  const res = await axiosInstance.get("/products");
  return res.data;
};
