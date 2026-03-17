// Listens to tthe browser's online/offline events
// 2. THe backed /health every 30seconds

import { useEffect } from "react";
import { useSyncStore } from "../stores/syncStore";

const POLL_INTERVAL_MS = 30_000; // 30 seconds

export function useSyncWatcher() {
  const checkConnection = useSyncStore((state) => state.checkConnection);

  useEffect(() => {
    // Initial check on mount
    checkConnection();
    const handleOnline = () => {
      checkConnection();
    };

    const handleOffline = () => checkConnection();
    const handleFocus = () => checkConnection();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("focus", handleFocus);

    const interval = setInterval(checkConnection, POLL_INTERVAL_MS);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [checkConnection]);
}
