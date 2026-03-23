
import axios from "axios";

const TOKEN_KEY = "simxel_token";
const ADMIN_TOKEN_KEY = "simxel_admin_token";

function getBaseUrl(): string {
  if ((import.meta as any).env?.VITE_API_URL) return (import.meta as any).env.VITE_API_URL;
  const win = window as any;
  const port: number = win.__BACKEND_PORT__ ?? 3000;
  return `http://localhost:${port}/api/v1`;
}

let BASE_URL = getBaseUrl();

export const BACKEND_ORIGIN: string = (() => {
  if (BASE_URL.startsWith("/")) return window.location.origin;
  try {
    return new URL(BASE_URL).origin;
  } catch {
    return BASE_URL;
  }
})();

//  Main axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // Cookies don't work in Electron — use Bearer token
});

// Inject token before every request
axiosInstance.interceptors.request.use((config) => {
  const win = window as any;
  const port: number = win.__BACKEND_PORT__ ?? 3000;
  const runtimeUrl =
    (import.meta as any).env?.VITE_API_URL ?? `http://localhost:${port}/api/v1`;

  if (config.baseURL !== runtimeUrl) {
    config.baseURL = runtimeUrl;
  }

  // Admin token takes priority (for admin-only routes)
  const adminToken = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  const token = sessionStorage.getItem(TOKEN_KEY);
  const active = adminToken ?? token;

  if (active) {
    config.headers.Authorization = `Bearer ${active}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => Promise.reject(error),
);

//  Raw instance (no /api/v1 prefix, no credentials)
export const rawInstance = axios.create({
  baseURL: BACKEND_ORIGIN,
  timeout: 4000,
});

rawInstance.interceptors.request.use((config) => {
  const win = window as any;
  const port: number = win.__BACKEND_PORT__ ?? 3000;
  const origin = (import.meta as any).env?.VITE_API_URL
    ? new URL((import.meta as any).env.VITE_API_URL).origin
    : `http://localhost:${port}`;

  config.baseURL = origin;
  return config;
});
