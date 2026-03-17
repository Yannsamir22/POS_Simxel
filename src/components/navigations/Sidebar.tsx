import {
  HeartHandshake, LayoutDashboard, LogOut,
  Package, Receipt, Settings, Sheet, ShoppingBag, Users,
} from "lucide-react";
import { useT } from "../../hooks/useT";
import SyncIndicator from "../toggles/SyncIndicator";
import ToggleTheme from "../toggles/ToggleTheme";
import type { TabKey as AdminTab} from "../../pages/AdminPage";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const { t } = useT();


  const menu: { key: AdminTab; label: string; icon: React.ElementType }[] = [
    { key: "Dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { key: "Reports",   label: t("nav.reports"),   icon: Sheet },
    { key: "Packages",  label: t("nav.packages"),  icon: Package },
    { key: "Services",  label: t("nav.services"),  icon: HeartHandshake },
    { key: "Products",  label: t("nav.products"),  icon: ShoppingBag },
    { key: "Expenses",  label: t("nav.expenses"),  icon: Receipt },
    { key: "Employees", label: t("nav.employees"), icon: Users },
    { key: "Settings",  label: t("nav.settings"),  icon: Settings },
  ];

  return (
    <aside className="h-screen w-72 bg-base-100 border-r border-base-300 flex flex-col shrink-0">
      <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
        <h1 className="text-xl font-extrabold tracking-wide">Simxel Admin</h1>
        <ToggleTheme />
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {menu.map(({ key, label, icon: Icon }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all w-full
                ${active
                  ? "text-primary font-semibold bg-primary/5"
                  : "text-base-content/70 hover:text-primary hover:bg-base-200"}`}
            >
              <Icon size={20} />
              <span className="text-sm">{label}</span>
              {active && (
                <span className="absolute right-0 top-2 bottom-2 w-1 bg-primary rounded-l-md" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-base-300 p-4 space-y-2">
        <div className="px-2">
          <SyncIndicator variant="badge" />
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-error px-4 py-3 rounded-xl w-full transition hover:bg-error/10"
        >
          <LogOut size={20} />
          <span className="text-sm font-semibold">{t("nav.logout")}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;