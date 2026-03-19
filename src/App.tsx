// src/App.tsx
import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { axiosInstance } from "./api/api";
import Toast from "./components/Toast";
import { useSyncWatcher } from "./hooks/useSyncWatcher";
import AdminPage from "./pages/AdminPage";
import POSAdminLogin from "./pages/POSAdminLogin";
import POSLogin from "./pages/POSLogin";
import POSPage from "./pages/POSPage";
import SetupPage from "./pages/SetupPage";
import { useAuthStore } from "./stores/authStore";
import UpdateBanner from "./components/UpdateBanner";

type AppStatus = "checking" | "setup" | "ready";

function App() {
  const [appStatus, setAppStatus] = useState<AppStatus>("checking");

  const [loading, setLoading] = useState(true);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessLevel = useAuthStore((state) => state.accessLevel);

  useSyncWatcher();

  useEffect(() => {
    const boot = async () => {
      try {
        // 1. Check if the POS has been activated / configured
        const { data } = await axiosInstance.get("/config/status");
        if (!data.isConfigured) {
          setAppStatus("setup");
          return;
        }
        // 2. Configured — check existing auth session
        await checkAuth();
        setAppStatus("ready");
      } catch {
        // Backend unreachable on first boot or config check failed —
        // treat as setup needed so the user can activate
        setAppStatus("setup");
      }
    };
    boot();
  }, [checkAuth]);
  // Splash while checking

  if (appStatus === "checking") {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-base-100">
        <span className="loading loading-ball loading-xl text-accent" />
        <p className="mt-4 font-black tracking-[0.4em] text-[10px] opacity-50">
          Starting Simxel
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content">
      <UpdateBanner/>
      <Toast />
      <Router>
        <Routes>
          {/* First-run activation*/}
          <Route
            path="/setup"
            element={
              appStatus === "setup" ? (
                <SetupPage onDone={() => setAppStatus("ready")} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          {/* If not configured, everything goes to setup */}
          {appStatus === "setup" && (
            <Route path="*" element={<Navigate to="/setup" replace />} />
          )}
          {/* Public Login */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to={"/"} replace /> : <POSLogin />
            }
          />
          <Route
            path="/admin/login"
            element={
              isAuthenticated && accessLevel === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <POSAdminLogin />
              )
            }
          />

          <Route
            path="/"
            element={isAuthenticated ? <POSPage /> : <POSLogin />}
          />
          <Route
            path="/admin"
            element={
              isAuthenticated && accessLevel == "admin" ? (
                <AdminPage />
              ) : (
                <POSAdminLogin />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
