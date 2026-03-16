import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

// Map user-facing theme names → actual DaisyUI theme attribute values
type ThemeChoice = "light" | "dark" | "system";

const THEMES: { label: string; value: ThemeChoice; icon: any }[] = [
  { label: "System", value: "system", icon: Monitor },
  { label: "Light",  value: "light",  icon: Sun },
  { label: "Dark",   value: "dark",   icon: Moon },
];

function resolveAndApply(choice: ThemeChoice) {
  let resolved: "simxel" | "simxel-dark";

  if (choice === "system") {
    resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "simxel-dark"
      : "simxel";
  } else {
    resolved = choice === "dark" ? "simxel-dark" : "simxel";
  }

  document.documentElement.setAttribute("data-theme", resolved);
  localStorage.setItem("theme", choice); // store user's choice, not resolved value
}

const ToggleTheme = () => {
  const [theme, setTheme] = useState<ThemeChoice>(() => {
    return (localStorage.getItem("theme") as ThemeChoice) || "system";
  });

  useEffect(() => {
    resolveAndApply(theme);

    // React to OS preference changes when in system mode
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => resolveAndApply("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  const handleChange = (value: ThemeChoice) => {
    setTheme(value);
    resolveAndApply(value);
    localStorage.setItem("theme", value);
  };

  return (
    <div className="dropdown dropdown-end">
      <label
        tabIndex={0}
        className="btn btn-ghost btn-circle hover:scale-110 transition-transform"
      >
        {theme === "dark"   ? <Moon size={15} /> :
         theme === "light"  ? <Sun  size={15} /> :
                              <Monitor size={15} />}
      </label>

      <ul
        tabIndex={0}
        className="dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-md w-44"
      >
        {THEMES.map(({ label, value, icon: Icon }) => (
          <li key={value}>
            <button
              onClick={() => handleChange(value)}
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