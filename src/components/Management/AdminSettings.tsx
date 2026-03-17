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
import { useT } from "../../hooks/useT";
import { useAuthStore } from "../../stores/authStore";
import { useLanguageStore } from "../../stores/languageStore";

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

//  SVG mini-screen previews (hardcoded colours — they are illustrations)
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
      <clipPath id="adm-sp-l">
        <rect x="0" y="0" width="36" height="52" />
      </clipPath>
      <clipPath id="adm-sp-r">
        <rect x="36" y="0" width="36" height="52" />
      </clipPath>
    </defs>
    <g clipPath="url(#adm-sp-l)">
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
    <g clipPath="url(#adm-sp-r)">
      <rect width="72" height="52" rx="5" fill="#1d232a" />
      <rect x="0" y="0" width="72" height="11" rx="5" fill="#191e24" />
      <rect x="0" y="6" width="72" height="5" fill="#191e24" />
      <rect x="36" y="11" width="36" height="41" fill="#212830" />
      <rect x="38" y="15" width="28" height="3" rx="1.5" fill="#3a4555" />
      <rect x="38" y="21" width="20" height="2" rx="1" fill="#2a3240" />
      <rect
        x="38"
        y="33"
        width="28"
        height="4"
        rx="2"
        fill={BLUE}
        opacity="0.15"
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

//  Component
const AdminSettings: React.FC = () => {
  const { t } = useT();
  const { language, setLanguage } = useLanguageStore();
  const changeAdminPassword = useAuthStore((s) => s.changeAdminPassword);
  const changeManagerPassword = useAuthStore((s) => s.changeManagerPassword);

  const [theme, setThemeState] = useState<ThemeChoice>(
    () => (localStorage.getItem("theme") as ThemeChoice) ?? "system",
  );
  const handleTheme = (v: ThemeChoice) => {
    setThemeState(v);
    resolveAndApply(v);
  };

  // Manager password change

  const [oldManagerPass, setOldManagerPass] = useState("");
  const [newManagerPass, setNewManagerPass] = useState("");
  const [confManagerPass, setConfManagerPass] = useState("");
  const [pwdManagerLoading, setPwdManagerLoading] = useState(false);
  const [pwdManagerMsg, setPwdManagerMsg] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const handleManagerPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdManagerMsg(null);
    if (newManagerPass.length < 4) {
      setPwdManagerMsg({ ok: false, text: t("settings.passShort") });
      return;
    }
    if (newManagerPass !== confManagerPass) {
      setPwdManagerMsg({ ok: false, text: t("settings.passMismatch") });
      return;
    }
    setPwdManagerLoading(true);
    const res = await changeManagerPassword(oldManagerPass, newManagerPass);
    setPwdManagerLoading(false);
    if (res.success) {
      setPwdManagerMsg({ ok: true, text: t("settings.passSuccess") });
      setOldManagerPass("");
      setNewManagerPass("");
      setConfManagerPass("");
    } else {
      setPwdManagerMsg({ ok: false, text: res.error ?? t("common.error") });
    }
  };

  // Admin password change

  const [oldAdminPass, setOldAdminPass] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");
  const [confAdminPass, setConfAdminPass] = useState("");
  const [pwdAdminLoading, setPwdAdminLoading] = useState(false);
  const [pwdAdminMsg, setPwdAdminMsg] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const handleAdminPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdAdminMsg(null);
    if (newAdminPass.length < 4) {
      setPwdAdminMsg({ ok: false, text: t("settings.passShort") });
      return;
    }
    if (newAdminPass !== confAdminPass) {
      setPwdAdminMsg({ ok: false, text: t("settings.passMismatch") });
      return;
    }
    setPwdAdminLoading(true);
    const res = await changeAdminPassword(oldAdminPass, newAdminPass);
    setPwdAdminLoading(false);
    if (res.success) {
      setPwdAdminMsg({ ok: true, text: t("settings.passSuccess") });
      setOldAdminPass("");
      setNewAdminPass("");
      setConfAdminPass("");
    } else {
      setPwdAdminMsg({ ok: false, text: res.error ?? t("common.error") });
    }
  };

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
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-l-4 border-primary pl-5">
        <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight">
          {t("settings.title")}
        </h2>
        <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-[0.3em]">
          {t("settings.themeLabel")}
        </p>
      </div>

      {/* Appearance */}
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
                      <div
                        className={`w-full aspect-[4/3] rounded-lg overflow-hidden transition-all duration-200
                      ${active ? "ring-2 ring-primary shadow-lg" : "ring-2 ring-base-300"}`}
                      >
                        <Preview />
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
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
                  {lang === "en" ? "English" : "Français"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*  Security  */}
      <section className="bg-base-200 rounded-xl border border-base-300 overflow-hidden">
        {/*Change Admin Password form*/}
        <div className="p-5 border-b border-base-300 flex items-center gap-3">
          <Lock size={16} className="text-primary" />
          <div>
            <h3 className="font-black uppercase text-sm tracking-tight">
              {t("settings.security")}
            </h3>
            <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">
              {t("settings.changeAdminPass")}
            </p>
          </div>
        </div>

        <form onSubmit={handleAdminPasswordChange} className="p-5 space-y-4">
          <div className="space-y-3">
            <input
              type="password"
              placeholder={t("settings.currentPass")}
              value={oldAdminPass}
              onChange={(e) => setOldAdminPass(e.target.value)}
              className="input input-bordered w-full"
              required
            />
            <input
              type="password"
              placeholder={t("settings.newPass")}
              value={newAdminPass}
              onChange={(e) => setNewAdminPass(e.target.value)}
              className="input input-bordered w-full"
              required
            />
            <input
              type="password"
              placeholder={t("settings.confirmPass")}
              value={confAdminPass}
              onChange={(e) => setConfAdminPass(e.target.value)}
              className={`input input-bordered w-full ${
                confAdminPass && confAdminPass !== newAdminPass
                  ? "input-error"
                  : ""
              }`}
              required
            />
          </div>
          {pwdAdminMsg && (
            <div
              className={`flex items-center gap-2 text-sm font-bold p-3 rounded-lg
              ${pwdAdminMsg.ok ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}
            >
              {pwdAdminMsg.ok ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {pwdAdminMsg.text}
            </div>
          )}
          <button
            type="submit"
            disabled={pwdAdminLoading}
            className="btn btn-primary btn-sm rounded-lg font-bold uppercase tracking-widest"
          >
            {pwdAdminLoading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              t("settings.updatePass")
            )}
          </button>
        </form>
      </section>

      {/* Change Cashier Password form */}
      <section className="bg-base-200 rounded-xl border border-base-300 overflow-hidden">
        <div className="p-5 border-b border-base-300 flex items-center gap-3">
          <Lock size={16} className="text-primary" />
          <div>
            <h3 className="font-black uppercase text-sm tracking-tight">
              {t("settings.security")}
            </h3>
            <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">
              {t("settings.changeManagerPass")}
            </p>
          </div>
        </div>
        <form onSubmit={handleManagerPasswordChange} className="p-5 space-y-4">
          <div className="space-y-3">
            <input
              type="password"
              placeholder={t("settings.currentPass")}
              value={oldManagerPass}
              onChange={(e) => setOldManagerPass(e.target.value)}
              className="input input-bordered w-full"
              required
            />
            <input
              type="password"
              placeholder={t("settings.newPass")}
              value={newManagerPass}
              onChange={(e) => setNewManagerPass(e.target.value)}
              className="input input-bordered w-full"
              required
            />
            <input
              type="password"
              placeholder={t("settings.confirmPass")}
              value={confManagerPass}
              onChange={(e) => setConfManagerPass(e.target.value)}
              className={`input input-bordered w-full ${
                confManagerPass && confManagerPass !== newManagerPass
                  ? "input-error"
                  : ""
              }`}
              required
            />
          </div>
          {pwdManagerMsg && (
            <div
              className={`flex items-center gap-2 text-sm font-bold p-3 rounded-lg
              ${pwdManagerMsg.ok ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}
            >
              {pwdManagerMsg.ok ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {pwdManagerMsg.text}
            </div>
          )}
          <button
            type="submit"
            disabled={pwdManagerLoading}
            className="btn btn-primary btn-sm rounded-lg font-bold uppercase tracking-widest"
          >
            {pwdManagerLoading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              t("settings.updatePass")
            )}
          </button>
        </form>
      </section>

      {/* About*/}
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
            { label: "Application", value: "Simxel POS" },
            { label: "Version", value: "1.0.0" },
            { label: "Mode", value: "Point of Sale" },
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

export default AdminSettings;
