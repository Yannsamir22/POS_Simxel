import { axiosInstance } from "../api/api";

export const authAPI = {
  // GET /auth/me  — matches backend: router.get("/me", ...)
  checkMe: () => axiosInstance.get("/auth/me"),

  // POST /auth/login/manager
  loginManager: (data: { password: string }) =>
    axiosInstance.post("/auth/login/manager", data),

  // POST /auth/login/admin
  loginAdmin: (data: { password: string }) =>
    axiosInstance.post("/auth/login/admin", data),

  // POST /auth/logout/manager
  managerLogout: () => axiosInstance.post("/auth/logout/manager"),

  // POST /auth/logout/admin
  adminLogout: () => axiosInstance.post("/auth/logout/admin"),

  // PUT /auth/change-password/admin  (was wrongly POST /auth/changeAdminPassword)
  changeAdminPassword: (oldPass: string, newPass: string) =>
    axiosInstance.put("/auth/change-password/admin", {
      oldPassword: oldPass, // backend expects { oldPassword, newPassword }
      newPassword: newPass,
    }),

  // PUT /auth/change-password/manager
  changeManagerPassword: (oldPass: string, newPass: string) =>
    axiosInstance.put("/auth/change-password/manager", {
      oldPassword: oldPass,
      newPassword: newPass,
    }),
};
