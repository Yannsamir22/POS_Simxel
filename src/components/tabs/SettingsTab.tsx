import {
  AlertCircle,
  CheckCircle,
  Globe,
  Info,
  Lock,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import React, { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useLanguageStore } from "../../stores/languageStore";
import { useT } from "../../hooks/useT";

// Types ────────────
type ThemeChoice = "light" | "dark" | "system";

function resolveAndApply(choice: ThemeChoice) {
  const resolved =
    choice === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "simxel-dark"
        : "simxel"
      : choice === "dark"
        ? "simxel-dark"
        : "simxel";
  document.documentElement.setAttribute("data-theme", resolved);
  localStorage.setItem("theme", choice);
}

//  Mini screen previews 
// Colors hardcoded in SVG because these are static illustrations,
// not live UI — they always show the palette regardless of active theme.
const BLUE = "#0197f6";
const GREEN = "#16a34a";

const LightPreview: React.FC = () => (
  <svg
    viewBox="0 0 72 52"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <rect width="72" height="52" rx="5" fill="#f8fafc" />
    <rect x="0" y="0" width="72" height="11" rx="5" fill="#f1f5f9" />
    <rect x="0" y="6" width="72" height="5" fill="#f1f5f9" />
    <circle cx="8" cy="5.5" r="2.5" fill={BLUE} />
    <rect x="14" y="3.5" width="16" height="4" rx="2" fill="#cbd5e1" />
    <rect x="0" y="11" width="12" height="41" fill="#f1f5f9" />
    <circle cx="6" cy="19" r="3" fill={BLUE} opacity="0.9" />
    <circle cx="6" cy="29" r="3" fill={GREEN} opacity="0.6" />
    <circle cx="6" cy="39" r="3" fill="#cbd5e1" />
    <rect x="14" y="14" width="22" height="7" rx="3" fill="#e2e8f0" />
    <rect x="14" y="24" width="22" height="7" rx="3" fill="#e2e8f0" />
    <rect x="14" y="34" width="22" height="7" rx="3" fill="#e2e8f0" />
    <rect x="38" y="11" width="34" height="41" fill="#f8fafc" />
    <rect x="41" y="15" width="28" height="3" rx="1.5" fill="#cbd5e1" />
    <rect x="41" y="21" width="20" height="2" rx="1" fill="#e2e8f0" />
    <rect x="41" y="26" width="16" height="2" rx="1" fill="#e2e8f0" />
    <rect x="41" y="33" width="28" height="4" rx="2" fill="#e0f2fe" />
    <rect
      x="43"
      y="34.5"
      width="14"
      height="1.5"
      rx="1"
      fill={BLUE}
      opacity="0.6"
    />
    <rect x="41" y="40" width="28" height="8" rx="3" fill={GREEN} />
    <rect
      x="47"
      y="42.5"
      width="16"
      height="3"
      rx="1.5"
      fill="white"
      opacity="0.9"
    />
  </svg>
);

const DarkPreview: React.FC = () => (
  <svg
    viewBox="0 0 72 52"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <rect width="72" height="52" rx="5" fill="#1d232a" />
    <rect x="0" y="0" width="72" height="11" rx="5" fill="#191e24" />
    <rect x="0" y="6" width="72" height="5" fill="#191e24" />
    <circle cx="8" cy="5.5" r="2.5" fill={BLUE} />
    <rect x="14" y="3.5" width="16" height="4" rx="2" fill="#2a3240" />
    <rect x="0" y="11" width="12" height="41" fill="#191e24" />
    <circle cx="6" cy="19" r="3" fill={BLUE} opacity="0.9" />
    <circle cx="6" cy="29" r="3" fill={GREEN} opacity="0.6" />
    <circle cx="6" cy="39" r="3" fill="#2a3240" />
    <rect x="14" y="14" width="22" height="7" rx="3" fill="#2a3240" />
    <rect x="14" y="24" width="22" height="7" rx="3" fill="#2a3240" />
    <rect x="14" y="34" width="22" height="7" rx="3" fill="#2a3240" />
    <rect x="38" y="11" width="34" height="41" fill="#212830" />
    <rect x="41" y="15" width="28" height="3" rx="1.5" fill="#3a4555" />
    <rect x="41" y="21" width="20" height="2" rx="1" fill="#2a3240" />
    <rect x="41" y="26" width="16" height="2" rx="1" fill="#2a3240" />
    <rect
      x="41"
      y="33"
      width="28"
      height="4"
      rx="2"
      fill={BLUE}
      opacity="0.15"
    />
    <rect
      x="43"
      y="34.5"
      width="14"
      height="1.5"
      rx="1"
      fill={BLUE}
      opacity="0.5"
    />
    <rect x="41" y="40" width="28" height="8" rx="3" fill={GREEN} />
    <rect
      x="47"
      y="42.5"
      width="16"
      height="3"
      rx="1.5"
      fill="white"
      opacity="0.85"
    />
  </svg>
);

const SystemPreview: React.FC = () => (
  <svg
    viewBox="0 0 72 52"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <defs>
      <clipPath id="sp-l">
        <rect x="0" y="0" width="36" height="52" />
      </clipPath>
      <clipPath id="sp-r">
        <rect x="36" y="0" width="36" height="52" />
      </clipPath>
    </defs>
    <g clipPath="url(#sp-l)">
      <rect width="72" height="52" rx="5" fill="#f8fafc" />
      <rect x="0" y="0" width="72" height="11" rx="5" fill="#f1f5f9" />
      <rect x="0" y="6" width="72" height="5" fill="#f1f5f9" />
      <circle cx="8" cy="5.5" r="2.5" fill={BLUE} />
      <rect x="0" y="11" width="12" height="41" fill="#f1f5f9" />
      <circle cx="6" cy="19" r="3" fill={BLUE} opacity="0.9" />
      <circle cx="6" cy="29" r="3" fill={GREEN} opacity="0.6" />
      <circle cx="6" cy="39" r="3" fill="#cbd5e1" />
      <rect x="14" y="14" width="20" height="7" rx="3" fill="#e2e8f0" />
      <rect x="14" y="24" width="20" height="7" rx="3" fill="#e2e8f0" />
      <rect x="14" y="34" width="20" height="7" rx="3" fill="#e2e8f0" />
    </g>
    <g clipPath="url(#sp-r)">
      <rect width="72" height="52" rx="5" fill="#1d232a" />
      <rect x="0" y="0" width="72" height="11" rx="5" fill="#191e24" />
      <rect x="0" y="6" width="72" height="5" fill="#191e24" />
      <rect x="36" y="11" width="36" height="41" fill="#212830" />
      <rect x="38" y="15" width="28" height="3" rx="1.5" fill="#3a4555" />
      <rect x="38" y="21" width="20" height="2" rx="1" fill="#2a3240" />
      <rect x="38" y="26" width="16" height="2" rx="1" fill="#2a3240" />
      <rect
        x="38"
        y="33"
        width="28"
        height="4"
        rx="2"
        fill={BLUE}
        opacity="0.15"
      />
      <rect
        x="40"
        y="34.5"
        width="14"
        height="1.5"
        rx="1"
        fill={BLUE}
        opacity="0.5"
      />
      <rect x="38" y="40" width="28" height="8" rx="3" fill={GREEN} />
      <rect
        x="44"
        y="42.5"
        width="16"
        height="3"
        rx="1.5"
        fill="white"
        opacity="0.85"
      />
    </g>
    <line
      x1="36"
      y1="0"
      x2="36"
      y2="52"
      stroke={BLUE}
      strokeWidth="1"
      strokeDasharray="3 2"
      opacity="0.7"
    />
  </svg>
);

// Component 
const SettingsTab: React.FC = () => {
  const {t} = useT();
  const { language, setLanguage } = useLanguageStore();
const [theme, setThemeState] = useState<ThemeChoice>(
    () => (localStorage.getItem("theme") as ThemeChoice) ?? "system",
  );

  const handleTheme = (t: ThemeChoice) => {
    setThemeState(t);
    resolveAndApply(t);
  };

  // Theme card config 
  const THEMES: {
    label: string;
    value: ThemeChoice;
    icon: React.FC;
    preview: React.FC;
    desc: string;
  }[] = [
    {
      label: t("settings.themes.light"),
      value: "light",
      icon: Sun,
      preview: LightPreview,
      desc: t("settings.themes.lightDesc"),
    },
    {
      label: t("settings.themes.dark"),
      value: "dark",
      icon: Moon,
      preview: DarkPreview,
      desc: t("settings.themes.darkDesc"),
    },
    {
      label: t("settings.themes.system"),
      value: "system",
      icon: Monitor,
      preview: SystemPreview,
      desc: t("settings.themes.systemDesc"),
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4">
      {/* APPEARANCE */}
      <section className="bg-base-200 rounded-xl border border-base-300 overflow-hidden">
        <div className="p-5 border-b border-base-300 flex items-center gap-3">
          <Sun size={16} className="text-primary" />
          <div>
            <h3 className="font-black uppercase text-sm tracking-tight">
              {t("settings.appearance")}
            </h3>
            <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">
              {t("settings.themeLabel")}
            </p>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Theme cards */}
          <div>
            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-4">
              {t("settings.colorTheme")}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map(
                ({ label, value, icon: Icon, preview: Preview, desc }) => {
                  const active = theme === value;
                  return (
                    <button
                      key={value}
                      onClick={() => handleTheme(value)}
                      className={`group flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200
                      ${
                        active
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                          : "border-base-300 hover:border-base-content/20 hover:bg-base-300/30"
                      }`}
                    >
                      {/* Mini screen */}
                      <div
                        className={`w-full aspect-[4/3] rounded-lg overflow-hidden transition-all duration-200
                      ${active ? "ring-2 ring-primary shadow-lg" : "ring-2 ring-base-300"}`}
                      >
                        <Preview />
                      </div>

                      {/* Label */}
                      <div className="flex flex-col items-center gap-0.5 w-full">
                        <div className="flex items-center gap-1.5">
                          <Icon />
                          <span
                            className={`text-xs font-black uppercase tracking-wide
                          ${active ? "text-primary" : "text-base-content/70"}`}
                          >
                            {label}
                          </span>
                        </div>
                        <span className="text-[9px] opacity-40 font-bold">
                          {desc}
                        </span>
                      </div>

                      <div
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-200
                      ${active ? "bg-primary scale-125" : "bg-base-300"}`}
                      />
                    </button>
                  );
                },
              )}
            </div>

            {/* Palette reference strip */}
            <div className="flex items-center gap-4 mt-4 px-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary ring-2 ring-primary/30" />
                <span className="text-[10px] font-black uppercase opacity-50 tracking-widest">
                  {t("settings.primary")} #0197f6
                </span>
              </div>
              <div className="w-px h-4 bg-base-300" />
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-secondary ring-2 ring-secondary/30" />
                <span className="text-[10px] font-black uppercase opacity-50 tracking-widest">
                  {t("settings.secondary")} #16a34a
                </span>
              </div>
            </div>
          </div>

          {/* Language */}
          <div>
            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-3">
              {t("settings.language")}
            </p>
            <div className="flex gap-2">
              {(["en", "fr"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-bold transition-all
                    ${
                      language === lang
                        ? "border-secondary bg-secondary/10 text-secondary"
                        : "border-base-300 hover:border-base-content/30"
                    }`}
                >
                  <Globe size={15} />
                  {lang === "en" ? t("languages.english") : t("languages.french")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* APP INFO */}
      <section className="bg-base-200 rounded-xl border border-base-300 overflow-hidden">
        <div className="p-5 border-b border-base-300 flex items-center gap-3">
          <Info size={16} className="text-secondary" />
          <div>
            <h3 className="font-black uppercase text-sm tracking-tight">
              {t("settings.about")}
            </h3>
            <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">
              {t("settings.appInfo")}
            </p>
          </div>
        </div>
        <div className="p-5 space-y-2 text-sm">
          {[
            { label: t("settings.application"), value: "Simxel POS" },
            { label: t("settings.version"), value: "1.0.0" },
            { label: t("settings.mode"), value: "Point of Sale" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between items-center py-1.5 border-b border-base-300/50 last:border-0"
            >
              <span className="font-black uppercase text-[10px] tracking-widest opacity-50">
                {label}
              </span>
              <span className="font-bold text-xs">{value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SettingsTab;
