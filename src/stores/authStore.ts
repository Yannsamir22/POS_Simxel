import { create } from "zustand";
import { authAPI } from "../services/authService";
import type { AuthStore } from "../types/authTypes";

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  accessLevel: null,
  isAdmin: false,
  user: null,
  loading: true,

  checkAuth: async () => {
    set({ loading: true });

    try {
      const res = await authAPI.checkMe();
      const data = res?.data ?? {};

      if (!data.ok) {
        set({
          isAuthenticated: false,
          accessLevel: null,
          isAdmin: false,
          user: null,
          loading: false,
        });
        return;
      }

      // Backend returns role as "ADMIN", 'MANAGER, 'OWNER'

      const role: string = data.role ?? "";
      const isAdmin = ["ADMIN", "admin", "Owner"].includes(role);

      set({
        isAuthenticated: true,
        accessLevel: isAdmin ? "admin" : "manager",
        isAdmin,
        user: data.sub ?? null,
        loading: false,
      })
    } catch (error: any) {
      console.error(
        "checkAuth error:",
        error.response?.status,
        error.response?.data,
      );
      set({
        isAuthenticated: false,
        accessLevel: null,
        user: null,
        isAdmin: false,
        loading: false,
      });
    }
  },

  // Login Manager
  loginAsManager: async ({ password }) => {
    try {
      const res = await authAPI.loginManager({ password });

      if (res.data.ok) {
        await get().checkAuth();
        return { success: true };
      }

      return {
        success: false,
        error: res.data.error ?? "Login failed",
      };
    } catch(error: any) {
      return {
        success: false,
        error: error.response?.data?.error ??"Login error",
      };
    }
  },

  //    Login As Admin
  loginAsAdmin: async ({ password }) => {
    try {
      const res = await authAPI.loginAdmin({ password });

      if (res.data.ok) {
        await get().checkAuth();

        set({
          isAuthenticated: true,
          accessLevel: "admin",
          isAdmin: true,
        });

        return { success: true };
      }

      return {
        success: false,
        error: res.data.error ?? "Login failed",
      };
    } catch(error: any) {
      return {
        success: false,
        error: error.response?.data?.error ??"Login error",
      };
    }
  },

  // logout Manager
  managerLogout: async () => {
    try {
      await authAPI.managerLogout();
    } finally {
      set({
        isAuthenticated: false,
        accessLevel: null,
        user: null,
        isAdmin: false,
      });
    }
  },

  // Logout Admin
  adminLogout: async () => {
    try {
      await authAPI.adminLogout();
    } finally {
      set({
        isAuthenticated: false,
        accessLevel: null,
        user: null,
        isAdmin: false,
      });
    }
  },

  // ----------------
  // CHANGE ADMIN PASSWORD
  // ----------------

  changeAdminPassword: async (oldPass, newPass) => {
    set({ loading: true });

    try {
      const res = await authAPI.changeAdminPassword(oldPass, newPass);

      if (res.data.ok) {
        return { success: true };
      }

      return {
        success: false,
        error: res.data.error || "Error while changing password",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || "Error while changing password",
      };
    } finally {
      set({ loading: false });
    }
  },


    changeManagerPassword: async (oldPass, newPass) => {
    set({ loading: true });

    try {
      const res = await authAPI.changeManagerPassword(oldPass, newPass);

      if (res.data.ok) {
        return { success: true };
      }

      return {
        success: false,
        error: res.data.error || "Error while changing password",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || "Error while changing password",
      };
    } finally {
      set({ loading: false });
    }
  },
}));
