import { Eye, EyeOff, KeyRound, Lock, Unlock } from "lucide-react";
import React, { useState } from "react";
import { axiosInstance } from "../api/api";

interface SetupPageProps {
  onDone: () => void;
}

type Step = "key" | "passwords" | "activating" | "done";

const SetupPage: React.FC<SetupPageProps> = ({ onDone }) => {
  const [step, setStep] = useState<Step>("key");
  const [secretKey, setSecretKey] = useState("");
  const [mainPassword, setMainPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmAdmin, setConfirmAdmin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showMain, setShowMain] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Validate Secret key format
  const handleKeyNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = secretKey.trim().toUpperCase();
    if (!trimmed) return setError("Please enter a license key.");
    // Basic format: SIMXEL-XXXX-XXXX-XXXX
    if (!/^SIMXEL-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(trimmed)) {
      return setError("Invalid key format. Expected: SIMXEL-XXXX-XXXX-XXXX");
    }
    setSecretKey(trimmed);
    setStep("passwords");
  };

  //   Set passwords and activate

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!mainPassword.trim()) return setError("Manager password is required.");
    if (mainPassword.length < 4)
      return setError("Manager password must be at least 4 characters.");
    if (!adminPassword.trim()) return setError("Admin password is required.");
    if (adminPassword.length < 4)
      return setError("Admin password must be at least 4 characters.");
    if (adminPassword !== confirmAdmin)
      return setError("Admin passwords do not match.");
    if (mainPassword === adminPassword)
      return setError("Manager and admin passwords must be different.");

    setStep("activating");
    try {
      await axiosInstance.post("/pos/activate", {
        secretKey,
        mainPassword,
        adminPassword,
      });
      setStep("done");
      setTimeout(onDone, 1500);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        "Activation failed. Check your licence key and try again.";
      setError(msg);
      setStep("passwords");
    }
  };

  //   Done
  if (step === "done") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
        <div className="p-6 rounded-full bg-success/10 text-success">
          <Unlock size={48} />
        </div>
        <p className="font-black text-2xl uppercase tracking-tighter text-success">
          Activated!
        </p>
        <p className="text-sm opacity-50">Redirecting…</p>
      </div>
    );
  }

  //   Activating spinner
  if (step === "activating") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
        <span className="loading loading-ball loading-xl text-primary" />
        <p className="font-black uppercase tracking-[0.4em] text-[10px] opacity-50">
          Activating…
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-base-100 px-4">
      {/* Brand */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-primary tracking-tighter">
          Simxel
        </h1>
        <p className="text-sm opacity-50 mt-1">
          {step === "key"
            ? "Enter your licence key to get started"
            : "Set your access passwords"}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {(["key", "passwords"] as Step[]).map((s, i) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === s || (step === "passwords" && i === 1)
                ? "w-8 bg-primary"
                : "w-3 bg-base-300"
            }`}
          />
        ))}
      </div>

      <div className="bg-base-200 rounded-2xl shadow-2xl border border-base-300 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-base-300 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            {step === "key" ? <KeyRound size={20} /> : <Lock size={20} />}
          </div>
          <div>
            <h2 className="font-black uppercase text-sm tracking-tight">
              {step === "key" ? "Licence Key" : "Access Passwords"}
            </h2>
            <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">
              {step === "key"
                ? "Provided by Simxel when you registered"
                : "These protect your POS and admin panel"}
            </p>
          </div>
        </div>

        {/* Key */}
        {step === "key" && (
          <form onSubmit={handleKeyNext} className="p-6 space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-60">
                  Licence Key *
                </span>
              </label>
              <input
                type="text"
                value={secretKey}
                onChange={(e) => {
                  setSecretKey(e.target.value);
                  setError(null);
                }}
                placeholder="SIMXEL-XXXX-XXXX-XXXX"
                className={`input input-bordered w-full font-mono tracking-widest uppercase ${error ? "input-error" : ""}`}
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />
              {error && (
                <p className="text-error font-bold text-xs mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full font-black uppercase tracking-widest"
            >
              Continue →
            </button>
          </form>
        )}
        {/* Passwords */}
        {step === "passwords" && (
          <form onSubmit={handleActivate} className="p-6 space-y-4">
            {/* Manager password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-60">
                  Manager Password *
                </span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type={showMain ? "text" : "password"}
                  value={mainPassword}
                  onChange={(e) => {
                    setMainPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Cashier / manager PIN"
                  className="grow"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowMain(!showMain)}
                  className="opacity-40 hover:opacity-100"
                >
                  {showMain ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </label>
            </div>

            {/* Admin password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-60">
                  Admin Password *
                </span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type={showAdmin ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Boss / admin code"
                  className="grow"
                />
                <button
                  type="button"
                  onClick={() => setShowAdmin(!showAdmin)}
                  className="opacity-40 hover:opacity-100"
                >
                  {showAdmin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </label>
            </div>

            {/* Confirm admin password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-60">
                  Confirm Admin Password *
                </span>
              </label>
              <input
                type="password"
                value={confirmAdmin}
                onChange={(e) => {
                  setConfirmAdmin(e.target.value);
                  setError(null);
                }}
                placeholder="Repeat admin code"
                className={`input input-bordered w-full ${error ? "input-error" : ""}`}
              />
            </div>

            {error && (
              <div className="bg-error/10 text-error font-bold text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep("key");
                  setError(null);
                }}
                className="btn btn-ghost flex-1 font-bold"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1 font-black uppercase tracking-widest"
              >
                Activate
              </button>
            </div>
          </form>
        )}
      </div>

      <p className="mt-6 text-[10px] opacity-30 text-center">
        Simxel POS · First-time activation
      </p>
    </div>
  );
};


export default SetupPage;