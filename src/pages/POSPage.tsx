import { useEffect, useState } from "react";
import Navbar from "../components/navigations/Navbar";
import PosSidebar from "../components/navigations/PosSidebar";
import TicketSidebar from "../components/POS/TicketSidebar";
import ExpensesTab from "../components/tabs/ExpensesTab";
import PackagesTab from "../components/tabs/PackagesTab";
import ProductsTab from "../components/tabs/ProductsTab";
import ServicesTab from "../components/tabs/ServicesTab";
import SettingsTab from "../components/tabs/SettingsTab";
import { useEmployeeStore } from "../stores/employeeStore";
import { useAuthStore } from "../stores/authStore";

const POSPage: React.FC = () => {
  // Load Employees
  const { loadEmployees } = useEmployeeStore();

  const managerLogout = useAuthStore((state) => state.managerLogout);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const [activeTab, setActiveTab] = useState<string>("Products");

  //  Function to render the tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Products":
        return <ProductsTab />;
      case "Services":
        return <ServicesTab />;
      case "Packages":
        return <PackagesTab />;
      case "Expenses":
        return <ExpensesTab />;
      case "Settings":
        return <SettingsTab />;
      default:
        return null;
    }
  };
  return (
    <div className="flex h-screen flex-col">
      {/* Fixed Navigation Bar */}
      <Navbar />

      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Sidebar */}
        <PosSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={managerLogout}
        />
        {/* Main Content */}
        <div className="flex-1 flex">
          <div className="flex-1 p-4 overflow-y-auto">{renderTabContent()}</div>
          {/* Ticket Sidebar */}
          <div className="w-95 shrink-0 border-l border-base-300">
            <TicketSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSPage;
