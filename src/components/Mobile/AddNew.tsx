import {
  HeartHandshake,
  Package,
  Receipt,
  ShoppingBag,
  UserRound,
} from "lucide-react";
// interface for the shared functionality of the sidebar component, including active tab state and logout handler
interface SidebarProps {
  activeTab: string; // the currently active tab in the sidebar
  setActiveTab: (tab: string) => void; // function to update the active sidebar
}
const AddNew: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menu = [
    { name: "Packages", icon: Package },
    { name: "Services", icon: HeartHandshake },
    { name: "Products", icon: ShoppingBag },
    { name: "Employees", icon: UserRound },
    { name: "Expenses", icon: Receipt },
  ];
  return (
    <aside className="max-h-screen w-14 flex flex-col bg-base-100 border border-base-300 shrink-0 justify-center mt-[20vh] rounded-l-2xl right-0 absolute">
      <nav className="flex-1 px-2 py-6 space-y-2 flex-col flex items-center justify-center">
        {menu.map(({ name, icon: Icon }) => (
          <button className={`flex flex-col items-center rounded-md p-1`}>
            <Icon size={20} />
            <span className=" hover:block hidden">{name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AddNew;
