import { create } from "zustand";
import { authAPI } from "../services/authService";
import type { AuthStore } from "../types/authTypes";

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  isConfigured: null,
  accessLevel: null,
  isAdmin: false,
  user: null,
  loading: true,

  checkAuth: async () => {
    set({ loading: true });

    try {
      const res = await authAPI.checkMe();
      const data = res?.data ?? {};

      // Some backends return { ok: true, role: "ADMIN" }, others return { role: "admin" }.
      const ok = typeof data.ok === "boolean" ? data.ok : true;
      const role =
        data.role ??
        data.user?.role ??
        // Some APIs nest payload under data.data
        data.data?.role ??
        null;

      if (ok) {
        const normalizedRole =
          typeof role === "string" ? role.trim().toLowerCase() : null;

        set({
          isAuthenticated: true,
          accessLevel: normalizedRole === "admin" ? "admin" : "manager",
          isAdmin: normalizedRole === "admin",
          user: role ?? null,
          loading: false,
        });
      } else {
        set({
          isAuthenticated: false,
          accessLevel: null,
          user: null,
          isAdmin: false,
          loading: false,
        });
      }
    } catch (error: any) {
      // If 401, don't reset auth state if we just logged in (but since this is checkAuth, it's general)
      // For now, log the error for debugging
      console.error("checkAuth error:", error.response?.status, error.response?.data);
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
        error: res.data.error,
      };
    } catch {
      return {
        success: false,
        error: "Login error",
      };
    }
  },

  //    Login As Admin
  loginAsAdmin: async ({ password }) => {
    try {
      const res = await authAPI.loginAdmin({ password });

      if (res.data.ok) {
        await get().checkAuth();

        // In case the backend returns a role that isn't normalized, force admin
        // until the next successful /auth/me check.
        set({
          isAuthenticated: true,
          accessLevel: "admin",
          isAdmin: true,
        });

        return { success: true };
      }

      return {
        success: false,
        error: res.data.error,
      };
    } catch {
      return {
        success: false,
        error: "Login error",
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
        isAdmin: false
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
        isAdmin: false
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
        error:
          res.data.error ||
          "Error while changing password"
      };
    } catch (err: any) {
      return {
        success: false,
        error:
          err.response?.data?.error ||
          "Error while changing password"
      };
    } finally {
      set({ loading: false });
    }
}
}));
