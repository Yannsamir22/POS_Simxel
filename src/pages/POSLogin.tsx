import React, { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navigations/Navbar";
import { useT } from "../hooks/useT";

const POSLogin: React.FC = () => {
  const {t} = useT();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate();
  const loginAsManager = useAuthStore((state) => state.loginAsManager);
  const checkAuth = useAuthStore((state) => state.checkAuth);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!pin.trim()) return;
    setError(null);
    setSubmitting(true);
    
    const res = await loginAsManager({ password: pin });

    if (res.success) {
      navigate("/");
    } else {
      setError(res.error ?? t("auth.wrongPassword"));
      setPin("");
    }

    setSubmitting(false);
  };
  
  
  return (
    <div className="h-screen overflow-hidden flex flex-col w-full">
      <Navbar />
      
      <div className="flex justify-center pb-10 w-full">
        <div className="rounded-md shadow-xl w-full h-[calc(110vh-8rem)]">
          <div className="flex flex-col h-full overflow-hidden w-full items-center justify-center p-5 font-sans">
            <h1
              className={`text-5xl font-extrabold text-primary `}
            >
              {t("auth.welcome")}
            </h1>
            <p className="mt-2 text-base-content/60">
              {t("auth.readyMsg")}
            </p>
            <div className="mt-10 flex flex-col justify-center items-center w-full">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-start items-start space-y-5 bg-base-200 shadow-lg w-1/3 p-5 rounded-md relative"
              >
                <div className="absolute left-8.25 z-40 top-10 h-16 w-[2px] bg-primary" />
                <div className="relative w-full">
                  <span className="absolute z-40 left-2.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-sm bg-primary" />
                  <input
                    className={`input w-full pl-6 ${error ? "input-error" : ""}`}
                    type="password"
                    placeholder={t("auth.password")}
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setError(null);
                    }}
                    autoFocus
                    disabled={submitting}
                  />
                </div>
                <div className="relative w-1/2">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                  <button type="submit" className="btn w-full font-semibold"
                  disabled={submitting}>
                    {submitting ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      t("auth.access")
                    )}
                  </button>
                </div>
                {error && (
                  <p className="text-error font-bold text-sm ml-2">
                    {error}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSLogin;
