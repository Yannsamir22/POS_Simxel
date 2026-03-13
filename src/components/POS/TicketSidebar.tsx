import {
  ChevronLeft,
  ChevronRight,
  PlusSquare,
  Trash2,
  User,
} from "lucide-react";
import { useTicketStore } from "../../stores/useTicketStore";

const TicketSidebar = () => {

  const { currentTicket, removeItem, clearTicket, parkTicket, confirmTicket } = useTicketStore();

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
            <button className="btn btn-xs btn-circle btn-ghost text-primary">
              <PlusSquare size={14} />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center bg-base-100 p-2 rounded-xl border border-base-300 shadow-inner">
          <span className="text-xs font-bold opacity-50 uppercase">Total</span>
          <span className="text-xl font-black text-primary">
            {currentTicket.total.toLocaleString()} <span className="text-xs">FCFA</span>
          </span>
        </div>
      </div>

      {/* BODY : Liste des Services (Zone défilable) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {/* Exemple d'item Service avec employé */}
        {currentTicket.items.map((item) => (
  <div
    key={item.id}
    className="group flex flex-col p-3 rounded-2xl bg-base-200 border border-base-300/50 hover:border-primary/30 transition-all"
  >
    <div className="flex justify-between items-start mb-2">
      <span className="font-bold text-sm">{item.name}</span>
      <span className="font-mono font-bold">
        {item.price.toLocaleString()} FCFA
      </span>
    </div>

    <div className="flex justify-between items-center">
      {item.employee && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-lg">
          <User size={12} className="text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase">
            {item.employee}
          </span>
        </div>
      )}

      <button
        onClick={() => removeItem(item.id)}
        className="p-1 text-error opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 size={14} />
      </button>
    </div>
  </div>
))}

      </div>

      {/* FOOTER : Payment Repartition */}
      <div className="p-3 bg-base-200 border-t border-base-300 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
        <h3 className="text-[10px] font-black uppercase opacity-40 mb-4 tracking-widest text-center">
          Payment Repartition
        </h3>

        <div className="grid grid-cols-2 gap-1 mb-2">
          {["Cash", "OM", "MoMo", "Card"].map((method) => (
            <label
              key={method}
              className="flex items-center justify-between p-3 rounded-md border border-base-300 bg-base-100 hover:border-primary cursor-pointer transition-all group"
            >
              <span className="text-xs font-bold opacity-70 mr-2 group-hover:opacity-100">
                {method}
              </span>
              <input
                type=""
                name="payment"
                className="input input-xs input-ghost text-lg"
              />
            </label>
          ))}
        </div>

        {/* BOUTONS D'ACTION */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => clearTicket}
          className="btn btn-ghost btn-md rounded-md uppercase font-bold text-error border border-error/20 hover:bg-error/10">
            Cancel
          </button>
          <button
            onClick={confirmTicket}
          className="btn btn-primary rounded-md uppercase font-bold shadow-lg shadow-primary/30">
            Confirm
          </button>
        </div>
      </div>
    </aside>
  );
};

export default TicketSidebar;
