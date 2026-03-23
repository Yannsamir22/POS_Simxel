import { create } from "zustand";
import { axiosInstance, rawInstance } from "../api/api";

export type SyncStatus = "online" | "offline" | "unreachable" | "syncing";

interface SyncState {
  status: SyncStatus;
  lastSync: Date | null;

  checkConnection: () => Promise<void>;
  setSyncing: () => void;
  setSynced: () => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  // Optimistic initial state
  status: navigator.onLine ? "online" : "offline",
  lastSync: null,

  checkConnection: async () => {
    if (!navigator.onLine) {
      set({ status: "offline" });
      return;
    }
    set({ status: "syncing" });

    try {
      await rawInstance.get("/health");
      triggerSync().catch(() => {
        set({ status: "unreachable" });
      });
      set({ status: "online", lastSync: new Date() });
    } catch {
      set({ status: "unreachable" });
    }
  },

  setSyncing: () => set({ status: "syncing" }),
  setSynced: () => set({ status: "online", lastSync: new Date() }),
}));

async function triggerSync(): Promise<void> {
  try {
    await axiosInstance.post("/sync/run");
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      return;
    }

    if (status === 500) {
      console.warn("[Sync] Cloud sync unavailale (cloud DB not configured)");
      return;
    }
    throw error;
  }
}
