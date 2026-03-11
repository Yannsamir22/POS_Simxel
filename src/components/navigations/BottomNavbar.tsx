import {
  LayoutDashboard,
  LucideShoppingCart,
  PlusSquare,
  Settings,
  Sheet,
} from "lucide-react";

const BottomNavbar = () => {
  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Sales", icon: LucideShoppingCart },
    { name: "New", icon: PlusSquare },
    { name: "Report", icon: Sheet },
    { name: "Settings", icon: Settings },
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50">
      <nav
        className="
          flex justify-between items-center
          px-6 py-2
          bg-base-100 border-t border-base-300

          /* Mobile */
          w-full rounded-none

          /* Tablet */
          sm:max-w-md sm:mx-auto
          sm:mb-4
          sm:rounded-2xl
          sm:border
          sm:shadow-lg
        "
      >
        {menu.map(({ name, icon: Icon }) => (
          <button
            key={name}
            className="
              flex flex-col items-center justify-center
              flex-1
              transition-all duration-200
              hover:scale-105 active:scale-95
              text-base-content hover:text-primary
            "
          >
            {Icon === PlusSquare ? (
              <Icon size={28} strokeWidth={2.5} />
            ) : (
              <Icon size={22} />
            )}

            <span className="text-[11px] font-semibold mt-1">
              {name}
            </span>
          </button>
        ))}
      </nav>
    </footer>
  );
};

export default BottomNavbar;