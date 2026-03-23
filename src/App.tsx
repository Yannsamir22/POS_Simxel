
import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";
import { axiosInstance } from "./api/api";
import Toast from "./components/Toast";
import UpdateBanner from "./components/UpdateBanner";
import { useSyncWatcher } from "./hooks/useSyncWatcher";
import AdminPage from "./pages/AdminPage";
import POSAdminLogin from "./pages/POSAdminLogin";
import POSLogin from "./pages/POSLogin";
import POSPage from "./pages/POSPage";
import SetupPage from "./pages/SetupPage";
import { useAuthStore } from "./stores/authStore";

type AppStatus = "checking" | "setup" | "ready";

function App() {
  const [appStatus, setAppStatus] = useState<AppStatus>("checking");
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessLevel = useAuthStore((s) => s.accessLevel);

  useSyncWatcher();

  useEffect(() => {
    const boot = async () => {
      try {
        const { data } = await axiosInstance.get("/config/status");
        if (!data.isConfigured) {
          setAppStatus("setup");
          return;
        }
        await checkAuth();
        setAppStatus("ready");
      } catch {
        // Backend not ready or config check failed → go to setup
        setAppStatus("setup");
      }
    };
    boot();
  }, [checkAuth]);

  //  Splash screen while booting 
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

  //  Setup screen — rendered BEFORE the router so no route can intercept 
  if (appStatus === "setup") {
    return (
      <div className="min-h-screen bg-base-100 font-sans text-base-content">
        <Toast />
        <SetupPage onDone={() => setAppStatus("ready")} />
      </div>
    );
  }

  //  Main app — only reached when appStatus === "ready" ─
  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content">
      <UpdateBanner />
      <Toast />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <POSLogin />
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
              isAuthenticated && accessLevel === "admin" ? (
                <AdminPage />
              ) : (
                <POSAdminLogin />
              )
            }
          />
          {/* Catch-all — redirect unknown paths to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
