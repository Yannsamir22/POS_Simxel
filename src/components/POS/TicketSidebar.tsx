import { ChevronLeft, ChevronRight, PlusSquare } from "lucide-react";
import { useState } from "react";
import { useTicketStore } from "../../stores/useTicketStore";
import TicketItemRenderer from "../ticket/TicketItemRenderer";

const TicketSidebar = () => {
  const {
    currentTicket,
    clearTicket,
    confirmTicket,
    addPayment,
  } = useTicketStore();

  const [paymentAmounts, setPaymentAmounts] = useState<{
    [key: string]: number;
  }>({
    CASH: 0,
    OM: 0,
    MOMO: 0,
    CARD: 0,
  });

  return (
    <aside className="fixed inset-y-0 right-0 w-full sm:w-1/3 bg-base-100 border-l border-base-300 flex flex-col shadow-2xl mt-16">
      {/* HEADER : Navigation & Total Rapide */}
      <div className="p-4 bg-base-200 border-b border-base-300">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-black italic text-primary tracking-tighter uppercase">
            Ticket
          </h2>
          <div className="flex gap-1">
            <button className="btn btn-xs btn-circle btn-ghost">
              <ChevronLeft size={14} />
            </button>
            <button className="btn btn-xs btn-circle btn-ghost">
              <ChevronRight size={14} />
            </button>
            <button
              onClick={clearTicket}
              className="btn btn-xs btn-circle btn-ghost text-primary"
            >
              <PlusSquare size={14} />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center bg-base-100 p-2 rounded-xl border border-base-300 shadow-inner">
          <span className="text-xs font-bold opacity-50 uppercase">Total</span>
          <span className="text-xl font-black text-primary">
            {currentTicket.total.toLocaleString()}{" "}
            <span className="text-xs">FCFA</span>
          </span>
        </div>
      </div>

      {/* BODY : Liste des Services (Zone défilable) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {currentTicket.items.map((item) => (
          <TicketItemRenderer 
          key={item.id}
          item={item} />
        ))}
      </div>

      {/* FOOTER : Payment Repartition */}
      <div className="p-3 bg-base-200 border-t border-base-300 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
        <h3 className="text-[10px] font-black uppercase opacity-40 mb-4 tracking-widest text-center">
          Payment Repartition
        </h3>

        <div className="grid grid-cols-2 gap-1 mb-2">
          {[
            { label: "Cash", method: "CASH" },
            { label: "OM", method: "OM" },
            { label: "MoMo", method: "MOMO" },
            { label: "Card", method: "CARD" },
          ].map(({ label, method }) => (
            <label
              key={method}
              className="flex items-center justify-between p-3 rounded-md border border-base-300 bg-base-100 hover:border-primary cursor-pointer transition-all group"
            >
              <span className="text-xs font-bold opacity-70 mr-2 group-hover:opacity-100">
                {label}
              </span>
              <input
                type="number"
                value={paymentAmounts[method] || ""}
                onChange={(e) => {
                  const amount = parseFloat(e.target.value) || 0;
                  setPaymentAmounts((prev) => ({ ...prev, [method]: amount }));
                  // Optionally add to store immediately, but for now, on confirm
                }}
                className="input input-xs input-ghost text-lg"
                placeholder="0"
              />
            </label>
          ))}
        </div>

        {/* BOUTONS D'ACTION */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              clearTicket();
              setPaymentAmounts({ CASH: 0, OM: 0, MOMO: 0, CARD: 0 });
            }}
            className="btn btn-ghost btn-md rounded-md uppercase font-bold text-error border border-error/20 hover:bg-error/10"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              Object.entries(paymentAmounts).forEach(([method, amount]) => {
                if (amount > 0)
                  addPayment({
                    method: method as "CASH" | "OM" | "MOMO" | "CARD",
                    amount,
                  });
              });
              confirmTicket();
            }}
            className="btn btn-primary rounded-md uppercase font-bold shadow-lg shadow-primary/30"
          >
            Confirm
          </button>
        </div>
      </div>
    </aside>
  );
};

export default TicketSidebar;
