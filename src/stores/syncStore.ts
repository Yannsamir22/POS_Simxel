import { create } from "zustand";
import { rawInstance } from "../api/api";

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
      set({ status: "online", lastSync: new Date() });
    } catch {
      set({ status: "unreachable" });
    }
  },

  setSyncing: () => set({ status: "syncing" }),
  setSynced: () => set({ status: "online", lastSync: new Date() }),
}));
