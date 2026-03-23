import { create } from "zustand";
import { authAPI } from "../services/authService";
import type { AuthStore } from "../types/authTypes";

// ── Token helpers ─────────────────────────────────────────────────────────────
const TOKEN_KEY = "simxel_token";
const ADMIN_TOKEN_KEY = "simxel_admin_token";

function saveToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}
function saveAdminToken(token: string) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}
function clearTokens() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  accessLevel: null,
  isAdmin: false,
  user: null,
  loading: true,

  // ── Check existing session ─────────────────────────────────────────────────
  checkAuth: async () => {
    set({ loading: true });
    try {
      const res = await authAPI.checkMe();
      const data = res?.data ?? {};

      if (!data.ok) {
        clearTokens();
        set({
          isAuthenticated: false,
          accessLevel: null,
          isAdmin: false,
          user: null,
          loading: false,
        });
        return;
      }

      const role = data.role ?? "";
      const isAdmin = ["ADMIN", "admin", "Owner"].includes(role);

      set({
        isAuthenticated: true,
        accessLevel: isAdmin ? "admin" : "manager",
        isAdmin,
        user: data.sub ?? null,
        loading: false,
      });
    } catch (error: any) {
      console.error(
        "checkAuth error:",
        error.response?.status,
        error.response?.data,
      );
      clearTokens();
      set({
        isAuthenticated: false,
        accessLevel: null,
        user: null,
        isAdmin: false,
        loading: false,
      });
    }
  },

  // ── Login Manager ──────────────────────────────────────────────────────────
  loginAsManager: async ({ password }) => {
    try {
      const res = await authAPI.loginManager({ password });

      if (res.data.ok) {
        // Save the token so every subsequent request includes it
        if (res.data.token) saveToken(res.data.token);
        await get().checkAuth();
        return { success: true };
      }

      return { success: false, error: res.data.error ?? "Login failed" };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Login error",
      };
    }
  },

  // ── Login Admin ────────────────────────────────────────────────────────────
  loginAsAdmin: async ({ password }) => {
    try {
      const res = await authAPI.loginAdmin({ password });

      if (res.data.ok) {
        // Admin token is separate so it doesn't overwrite the manager token
        const token = res.data.adminToken ?? res.data.token;
        if (token) saveAdminToken(token);
        // Also set as main token so requireAuth passes on all routes
        if (token) saveToken(token);

        set({ isAuthenticated: true, accessLevel: "admin", isAdmin: true });
        await get().checkAuth();
        return { success: true };
      }

      return { success: false, error: res.data.error ?? "Login failed" };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Login error",
      };
    }
  },

  // ── Logout Manager ─────────────────────────────────────────────────────────
  managerLogout: async () => {
    try {
      await authAPI.managerLogout();
    } catch {
      /* ignore */
    } finally {
      clearTokens();
      set({
        isAuthenticated: false,
        accessLevel: null,
        user: null,
        isAdmin: false,
      });
    }
  },

  // ── Logout Admin ───────────────────────────────────────────────────────────
  adminLogout: async () => {
    try {
      await authAPI.adminLogout();
    } catch {
      /* ignore */
    } finally {
      clearTokens();
      set({
        isAuthenticated: false,
        accessLevel: null,
        user: null,
        isAdmin: false,
      });
    }
  },

  // ── Change admin password ──────────────────────────────────────────────────
  changeAdminPassword: async (oldPass, newPass) => {
    set({ loading: true });
    try {
      const res = await authAPI.changeAdminPassword(oldPass, newPass);
      if (res.data.ok) return { success: true };
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

  // ── Change manager password ────────────────────────────────────────────────
  changeManagerPassword: async (oldPass, newPass) => {
    set({ loading: true });
    try {
      const res = await authAPI.changeManagerPassword(oldPass, newPass);
      if (res.data.ok) return { success: true };
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
