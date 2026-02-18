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

// interface for the shared functionality of the sidebar component, including active tab state and logout handler
interface SidebarProps {
  activeTab: string; // the currently active tab in the sidebar
  setActiveTab: (tab: string) => void; // function to update the active sidebar
  onLogout: () => void; // function to handle user logout action
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    {name: "Reports", icon: Sheet},
    { name: "Package", icon: Package },
    { name: "Services", icon: HeartHandshake },
    { name: "Produits", icon: ShoppingBag },
    { name: "Dépenses", icon: Receipt },
    { name: "Employés", icon: Users },
    { name: "Settings", icon: Settings },
  ];

  return (
    <aside className="h-screen w-72 bg-base-100 border-r border-base-300 flex flex-col shrink-0">
      <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
        <h1 className="text-xl font-extrabold tracking-wide ">Simxel Admin</h1>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2">
        {menu.map(({ name, icon: Icon }) => (
          <button
            key={name}
            onClick={() => setActiveTab(name)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full ${
              activeTab === name
                ? "bg-primary text-primary-content shadow-lg scale-105"
                : "hover:border-2 hover:border-primary hover:bg-base-200 hover:text-primary text-base-content/70"
            }`}
          >
            <Icon size={20}  />
            <span className="font-medium">{name}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-base-300 p-4 space-y-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-error hover:bg-inherit px-4 py-3 rounded-xl w-full transition hover:font-extrabold"
        >
          <LogOut size={20} />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
