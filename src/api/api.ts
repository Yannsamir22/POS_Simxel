import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // For hhtpOnly cookies
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  },
);
