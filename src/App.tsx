// src/App.tsx
import { useEffect, useState, type JSX } from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import POSLogin from "./pages/POSLogin";
import POSAdminLogin from "./pages/POSAdminLogin";
import POSPage from "./pages/POSPage";
import AdminPage from "./pages/AdminPage";
import { useAuthStore } from "./stores/authStore";

function App() {
  const [loading, setLoading] = useState(true);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessLevel = useAuthStore((state) => state.accessLevel);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setLoading(false);
    };
    initAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-base-100">
        <span className="loading loading-ball loading-xl text-accent" />
        <p className="mt-4 font-black tracking-[0.4em] text-[10px] opacity-50">Starting Simxel</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 font-sans text-base-content">
      <Router>
        <Routes>
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

            <Route path="/" element={isAuthenticated ? <POSPage/> : <POSLogin />} />
          <Route path="/admin" element={isAuthenticated && accessLevel=="admin" ? <AdminPage/> : <POSAdminLogin/>} />

          

        </Routes>
      </Router>
    </div>
  );
}

export default App;