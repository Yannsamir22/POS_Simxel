// src/App.tsx
import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/navigations/Navbar";
import Sidebar from "./components/navigations/Sidebar";
import ChooseProduct from "./components/POS/ChooseProduct";
import POSLogin from "./pages/POSLogin";
import POSAdminLogin from "./pages/POSAdminLogin";
import AdminPage from "./pages/AdminPAge";

const navItems = [
  { name: "Services", href: "/service-sale" },
  { name: "Products", href: "/product-sale" },
];
function App() {
  const [activePath, setActivePath] = useState("/");

  const loading: boolean = false;
  if (loading) {
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
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<POSLogin />} />
          <Route path="/" element={<ChooseProduct />} />
          <Route path="/admin/login" element={<POSAdminLogin/>} />
          <Route path="/admin" element={<AdminPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
