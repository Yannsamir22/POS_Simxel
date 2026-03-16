import { useState } from "react";
import Sidebar from "../components/navigations/Sidebar";

import AdminSettings from "../components/Management/AdminSettings";
import Dashboard from "../components/Management/Dashboard";
import EmployeeManagement from "../components/Management/EmployeeManagement";
import ExpenseManagement from "../components/Management/ExpenseManagement";
import PackManagement from "../components/Management/PackManagement";
import ProductManagement from "../components/Management/ProductManagement";
import ReportsManagement from "../components/Management/ReportsManagement";
import ServiceManagement from "../components/Management/ServiceManagement";
import { useAuthStore } from "../stores/authStore";

const AdminPage: React.FC = () => {
  const adminLogout = useAuthStore((state) => state.adminLogout);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "Employees":
        return <EmployeeManagement />;
      case "Services":
        return <ServiceManagement />;
      case "Products":
        return <ProductManagement />;
      case "Packages":
        return <PackManagement />;
      case "Expenses":
        return <ExpenseManagement />;
      case "Dashboard":
        return <Dashboard />;
      case "Reports":
        return <ReportsManagement />;
      case "Settings":
        return <AdminSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen bg-base-200 overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-72">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={adminLogout}
        />
      </div>

      {/* Main Content */}
      <main className="ml-72 h-screen overflow-y-auto p-8">
        <div
          key={activeTab}
          className="animate-in fade-in slide-in-from-bottom-2 duration-300 h-full"
        >
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
