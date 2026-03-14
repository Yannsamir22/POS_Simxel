import {
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Package,
  Receipt,
  Settings,
  Sheet,
  ShoppingBag,
  Users,
} from "lucide-react";
import ToggleTheme from "../toggles/ToggleTheme";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Reports", icon: Sheet },
    { name: "Packages", icon: Package },
    { name: "Services", icon: HeartHandshake },
    { name: "Products", icon: ShoppingBag },
    { name: "Expenses", icon: Receipt },
    { name: "Employees", icon: Users },
    { name: "Settings", icon: Settings },
  ];

  return (
    <aside className="h-screen w-72 bg-base-100 border-r border-base-300 flex flex-col shrink-0">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
        <h1 className="text-xl font-extrabold tracking-wide">Simxel Admin</h1>
        <ToggleTheme />
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menu.map(({ name, icon: Icon }) => {
          const active = activeTab === name;

          return (
            <button
              key={name}
              onClick={() => setActiveTab(name)}
              className={`relative flex items-center gap-3 px-4 py-2 rounded-xl transition-all w-full
              ${
                active
                  ? "text-primary font-semibold"
                  : "text-base-content/70 hover:text-primary"
              }`}
            >
              <Icon size={20} />
              <span>{name}</span>

              {/* RIGHT ACTIVE INDICATOR */}
              {active && (
                <span className="absolute right-0 top-2 bottom-2 w-1 bg-primary rounded-l-md" />
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-base-300 p-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-error px-4 py-3 rounded-xl w-full transition hover:font-semibold"
        >
          <LogOut size={20} />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;