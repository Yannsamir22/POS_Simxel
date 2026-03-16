import {
  HeartHandshake,
  LogOut,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
} from "lucide-react";
interface SidebarProps {
  activeTab: string; // the currently active tab in the sidebar
  setActiveTab: (tab: string) => void; // function to update the active sidebar
  onLogout: () => void; // function to handle user logout action
}

const menu = [
    { name: "Packages", icon: Package },
    { name: "Services", icon: HeartHandshake },
    { name: "Products", icon: ShoppingBag },
    { name: "Expenses", icon: Receipt },
    { name: "Settings", icon: Settings },
  ];
const PosSidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  
  return (
    <aside className="max-h-screen w-20 flex flex-col bg-base-100 border border-base-300 shrink-0 justify-between top-50 py-2 space-y-2 rounded-2xl fixed">
      <nav className="flex-1 px-1 py-6 space-y-5 flex-col flex items-center ">
        {menu.map(({ name, icon: Icon }) => (
          <button 
            key={name}
            onClick={() => setActiveTab(name)}
            title={name}
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
          title="Log out"
          className="flex flex-col items-center p-2 rounded-xl text-error hover:bg-error/10 transition-all"
        >
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default PosSidebar;
