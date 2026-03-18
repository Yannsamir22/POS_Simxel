import {
  HeartHandshake,
  LogOut,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { useT } from "../../hooks/useT";

interface SidebarProps {
  activeTab: string; // the currently active tab in the sidebar
  setActiveTab: (tab: string) => void; // function to update the active sidebar
  onLogout: () => void; // function to handle user logout action
}

const PosSidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const { t } = useT();

  const menu = [
    { name: "Services", label: t("nav.services"), icon: HeartHandshake },
    { name: "Products", label: t("nav.products"), icon: ShoppingBag },
    { name: "Packages", label: t("nav.packages"), icon: Package },
    { name: "Expenses", label: t("nav.expenses"), icon: Receipt },
    { name: "Settings", label: t("nav.settings"), icon: Settings },
  ];

  return (
    <aside className="max-h-screen w-16 flex flex-col bg-base-100 border border-base-300 shrink-0 justify-between top-50 py-2 space-y-2 rounded-r-2xl  left-0 fixed">
      <nav className="flex-1 px-1 py-6 space-y-5 flex-col flex items-center ">
        {menu.map(({ name, label, icon: Icon }) => (
          <button
            key={name}
            onClick={() => setActiveTab(name)}
            title={label}
            className={`relative flex items-center rounded-md p-1 hover:text-secondary transition-all hover:scale-125 ${
              activeTab === name
                ? "text-secondary transition-all scale-125"
                : ""
            }`}
          >
            <Icon size={18} />
            {activeTab === name && (
              <span className="absolute left-0 top-1.5 bottom-2 w-0.5 h-4 bg-secondary rounded-r-full -ml-3" />
            )}
          </button>
        ))}
      </nav>

      {/* Logout button */}
      <div className="border-t border-base-300 p-4 space-y-4">
        <button
          onClick={onLogout}
          title={t("nav.logout")}
          className="flex flex-col items-center p-2 rounded-xl text-error hover:bg-error/10 transition-all"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default PosSidebar;
