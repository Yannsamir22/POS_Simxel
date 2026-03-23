import { ChevronRight, LogOut, Menu, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "../../hooks/useT";
import { useAuthStore } from "../../stores/authStore";
import SyncIndicator from "../toggles/SyncIndicator";
import ToggleLanguage from "../toggles/ToggleLanguage";
import ToggleTheme from "../toggles/ToggleTheme";

// @ts-ignore
import logoLight from "../../assets/simxel_light.svg";
// @ts-ignore
import logoDark from "../../assets/simxel_dark.svg";

function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(() => document.documentElement.getAttribute("data-theme") === "simxel-dark")
  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute("data-theme") === "simxel-dark")
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    })

    return () => observer.disconnect()
  }, [])

  return isDark
}

const Navbar: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessLevel = useAuthStore((state) => state.accessLevel);
  const { t } = useT();
  const managerLogout = useAuthStore((state) => state.managerLogout);
  const adminLogout = useAuthStore((state) => state.adminLogout);
  const [isOpen, setIsOpen] = useState(false);
  const Navigate = useNavigate();

  const isDark = useIsDark();
  const logo = isDark ? logoDark : logoLight

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    if (accessLevel === "admin") {
      await adminLogout();
      Navigate("/admin/login", { replace: true });
    } else {
      await managerLogout();
      Navigate("/login", { replace: true });
    }
    setIsOpen(false);
  };
  return (
    <header className="fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80 border-b border-base-200">
      <div className="container mx-auto h-16 w-full flex items-center justify-between px-4 ">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => Navigate(accessLevel === "admin" ? "/admin" : "/")}
        >
          <figure className="h-15 w-30 flex items-center justify-center">
            <img
              src={logo}
              alt="Simxel"
              className="h-full object-contain"
            />
          </figure>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="btn btn-ghost flex items-center gap-2 hover:bg-error/20 hover:text-error transition-all"
            >
              <span className="text-sm">{t("nav.logout")}</span>
              <LogOut size={18} />
            </button>
          )}

          {accessLevel !== "admin" && (
            <button
              onClick={() => Navigate("/admin/login")}
              className="btn btn-ghost flex items-center gap-2 font-bold"
            >
              <span className="text-sm">{t("auth.adminSpace")}</span>
              <User size={15} />
            </button>
          )}
          <div className="flex items-center gap-2 border-l pl-4 border-base-300">
            <SyncIndicator variant="dot" />

            <ToggleLanguage />
            <ToggleTheme />
          </div>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="md:hidden flex items-center gap-1">
          <ToggleTheme />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 duration-75 transition-all"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <aside
            className={`absolute right-0 top-0 h-full w-[230px] bg-base-300 shadow-2xl p-2 pt-6 transition-transform duration-300 ease-in-out transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full mt-12 text-xs">
              <h2 className="text-xs font-semibold uppercase text-base-content/50 mb-4 px-2">
                {t("nav.menu")}
              </h2>
              <nav className="flex flex-col gap-2">
                {accessLevel !== "admin" && (
                  <button
                    onClick={() => {
                      Navigate("/admin/login");
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-base-200 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg text-primary">
                        <User size={20} />
                      </div>
                      <span className="font-medium">{t("nav.dashboard")}</span>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-base-content/30 group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                )}

                {isAuthenticated && (
                  <button className="flex items-center justify-between p-3 rounded-xl hover:bg-error/10 text-error transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-error/10 rounded-lg ">
                        <LogOut size={20} />
                      </div>
                      <span className="font-medium">{t("nav.logout")}</span>
                    </div>
                  </button>
                )}
              </nav>
              <div className="mt-auto pt-6 border-t border-base-200 bg-base-100">
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm font-medium">
                    {t("settings.language")}
                  </span>
                  <ToggleLanguage />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
