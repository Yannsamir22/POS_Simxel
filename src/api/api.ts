import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

// To take the backend origin since in dev the Vite proxy turns "/api/v1"
export const BACKEND_ORIGIN: string = (() => {
  const url = BASE_URL;
  if (url.startsWith("/")) return window.location.origin;

  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return url;
  }
})();

// Main Instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // For hhtpOnly cookies
});

// Uses the backend origin, no /api/v1 prefix, no credentials needed.
export const rawInstance = axios.create({
  baseURL: BACKEND_ORIGIN,
  timeout: 4000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  },
);
