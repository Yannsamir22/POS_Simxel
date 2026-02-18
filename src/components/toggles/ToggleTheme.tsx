import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "black" | "dark" | "system";

const themes: { label: string; value: Theme; icon: any }[] = [
  { label: "System", value: "system", icon: Monitor },
  { label: "Light", value: "light", icon: Sun },
  { label: "Black", value: "black", icon: Moon },
];

const ToggleTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "system";
  });

  useEffect(() => {
    let appliedTheme = theme;

    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      appliedTheme = prefersDark ? "black" : "light";
    }

    document.documentElement.setAttribute("data-theme", appliedTheme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className="btn btn-ghost btn-circle swap swap-rotate hover:scal-110 transition-transform"
      >
        <input
          type="checkbox"
          checked={theme === "black"}
        />
        <Sun size={20} />
        <Moon size={20} />
      </label>

      <ul
        tabIndex={0}
        className="dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-md w-44"
      >
        {themes.map(({ label, value, icon: Icon }) => (
          <li key={value}>
            <button
              onClick={() => setTheme(value)}
              className={`flex items-center gap-2 rounded-md ${
                theme === value ? "font-bold text-primary" : ""
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToggleTheme;
