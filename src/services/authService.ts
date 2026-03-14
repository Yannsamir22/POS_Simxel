import { axiosInstance } from "../api/api";

export const authAPI = {
  checkMe: () => axiosInstance.get("/auth/me"),

  setup: (data: { mainPassword: string; adminPassword: string }) =>
    axiosInstance.post("/auth/setup", data),

  loginManager: (data: { password: string }) =>
    axiosInstance.post("/auth/login/manager", data),

  loginAdmin: (data: { password: string }) =>
    axiosInstance.post("/auth/login/admin", data),

  managerLogout: () => axiosInstance.post("/auth/logout/manager"),

  adminLogout: () => axiosInstance.post("/auth/logout/admin"),

  changeAdminPassword: (oldPass: string, newPass: string) =>
    axiosInstance.post("/auth/changeAdminPassword", { oldPass, newPass }),
};
