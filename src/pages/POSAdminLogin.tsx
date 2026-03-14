import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import Navbar from "../components/navigations/Navbar";

const POSAdminLogin = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const loginAsAdmin = useAuthStore((state) => state.loginAsAdmin);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginAsAdmin({ password: pin });
    if (res.success) {
      navigate("/admin");
    } else {
      setError(true);
      setPin("");
    }
  };
  return (
    <div className="h-screen overflow-hidden flex flex-col w-full relative">
        <Navbar />
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="absolute top-20 left-6 btn btn-outline rounded-full flex items-center size-12"
      >
        <ArrowLeft />
      </button>
      <div className="flex justify-between pb-10 w-full">
        <div className="rounded-md shadow-cl w-full h-[calc(110vh-8rem)]">
          <div className="flex h-full overflow-hidden w-full items-center justify-center">
            <div className="w-2/3 flex flex-col items-center justify-center p-5">
              <h1 className="text-5xl font-extrabold">Admin Space</h1>
              <p className="mt-2 text-base-content/60">
                Good to see You back Boss
              </p>
              <div className="mt-10 flex flex-col justify-center items-center w-full">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col justify-start items-start space-y-5 bg-base-200 shadow-lg w-2/3 p-5 rounded-md relative"
                >
                  <div className="absolute left-8 z-40 top-9 h-16 w-px bg-primary" />
                  <div className="relative w-full">
                    <span className="absolute z-40 left-2.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-sm bg-primary" />
                    <input
                      className={`input pl-6 w-full ${error ? "input-error" : ""}`}
                      type="password"
                      placeholder="Admin Security Code"
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value);
                        setError(false);
                      }}
                      autoFocus
                    />
                  </div>
                  <div className="relative w-1/3">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                    <button
                      type="submit"
                      className="btn w-full font-semibold active:outline-none"
                    >
                      Unlock
                    </button>
                  </div>
                  {error && (
                    <p className="text-error font-bold text-sm ml-2">
                      Refused Access
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSAdminLogin;
