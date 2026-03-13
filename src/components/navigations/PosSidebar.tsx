import {
  HeartHandshake,
  LogOut,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
} from "lucide-react";
// interface for the shared functionality of the sidebar component, including active tab state and logout handler
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
  const menu = [
    { name: "Packages", icon: Package },
    { name: "Services", icon: HeartHandshake },
    { name: "Products", icon: ShoppingBag },
    { name: "Expenses", icon: Receipt },
    { name: "Settings", icon: Settings },
  ];
  return (
    <aside className="max-h-screen w-20 flex flex-col bg-base-100 border border-base-300 shrink-0 justify-center mt-[20vh] rounded-2xl fixed">
      <nav className="flex-1 px-1 py-6 space-y-5 flex-col flex items-center justify-center">
        {menu.map(({ name, icon: Icon }) => (
          <button 
            key={name}
            onClick={() => setActiveTab(name)}
            className={`flex items-center rounded-md p-1 hover:text-accent hover:scale-125 ${
      activeTab === name ? "text-accent scale-125" : ''}`}>
            <Icon size={20} />
          </button>
        ))}
      </nav>

      {/* Logout button */}
      <div className="border-t border-base-300 p-4 space-y-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 hover:bg-inherit px-4 py-3 rounded-xl w-full transition font-extrabold text-red-500"
        >
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default PosSidebar;
