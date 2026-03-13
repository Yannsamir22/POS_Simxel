import { useState } from "react";
import Sidebar from "../components/navigations/Sidebar";

import Dashboard from "../components/Management/Dashboard";
import EmployeeManagement from "../components/Management/EmployeeManagement";
import ExpenseManagement from "../components/Management/ExpenseManagement";
import PackManagement from "../components/Management/PackManagement";
import ProductManagement from "../components/Management/ProductManagement";
import ServiceManagement from "../components/Management/ServiceManagement";

const AdminPage = ({onLogout}) => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  // Function to render the component corresponding to the screen
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
      default:
        return <Dashboard />;
    }
  };
  return (
    <div className="flex h-screen bg-base-200 overflow-y-scroll">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Simple Animation */}
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
