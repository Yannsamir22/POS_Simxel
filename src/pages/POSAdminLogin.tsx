import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "../hooks/useT";
import { useAuthStore } from "../stores/authStore";
import ToggleTheme from "../components/toggles/ToggleTheme";

const POSAdminLogin: React.FC = () => {
  const [pin,        setPin]        = useState("");
  const [error,      setError]      = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate     = useNavigate();
  const { t }        = useT();
  const loginAsAdmin    = useAuthStore((s) => s.loginAsAdmin);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    setError(null);
    setSubmitting(true);
    const res = await loginAsAdmin({ password: pin });
    if (res.success) {
      navigate("/admin", { replace: true });
    } else {
      setError(res.error ?? t("auth.refusedAccess"));
      setPin("");
    }
    setSubmitting(false);
  };

  // fix: was `navigate(-1) && isAuthenticated ? navigate("/") : navigate("/login")`
  // navigate(-1) returns void (truthy) so the ternary ALWAYS fired a second navigate(),
  // overriding browser history and keeping the user on the same page.
  // Now: just go back if there's history, otherwise fall back to the correct login page.
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(isAuthenticated ? "/" : "/login");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-base-100">
      {/* Lean top bar — no full Navbar */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-base-300">
        <button
          type="button"
          onClick={handleBack}
          className="btn btn-ghost btn-sm gap-2 font-bold"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <span className="font-extrabold text-primary tracking-tighter">Simxel</span>
        <ToggleTheme />
      </div>

      {/* Login form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold">{t("auth.adminSpace")}</h1>
            <p className="mt-2 text-base-content/60">{t("auth.adminWelcome")}</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 bg-base-200 shadow-lg p-6 rounded-xl relative"
          >
            <div className="absolute left-9.5 z-40 top-10 h-16 w-px bg-primary" />

            <div className="relative">
              <span className="absolute z-40 left-2.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-sm bg-primary" />
              <input
                className={`input pl-6 w-full ${error ? "input-error" : ""}`}
                type="password"
                placeholder={t("auth.adminCode")}
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(null); }}
                autoFocus
                disabled={submitting}
              />
            </div>

            <div className="relative w-2/3">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
              <button
                type="submit"
                className="btn w-full font-semibold active:outline-none pl-6 hover:bg-primary/80"
                disabled={submitting}
              >
                {submitting
                  ? <span className="loading loading-spinner loading-xs" />
                  : t("auth.unlock")}
              </button>
            </div>

            {error && <p className="text-error font-bold text-sm">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default POSAdminLogin;