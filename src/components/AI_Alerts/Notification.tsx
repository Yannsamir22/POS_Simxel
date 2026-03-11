import { BotMessageSquareIcon, Trash2 } from "lucide-react";

const Notification = () => {
  return (
    <div className="px-2 w-full max-w-md mx-auto">
      <div className="group relative flex flex-col gap-2 p-1 rounded-xl bg-base-200 backdrop-blur-md border border-base-300 hover:border-base-content/20 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-primary/10 rounded-lg text-primary">
              <BotMessageSquareIcon size={16} />
            </div>
            <span className="font-bold text-sm tracking-wide uppercase opacity-70">
              AI System
            </span>
          </div>
    <button 
            className="p-1.5 hover:bg-error/10 text-base-content/40 hover:text-error rounded-md transition-colors"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* MESSAGE CONTENT */}
        <div className="text-sm font-medium leading-relaxed pr-2">
          They will be stock rupture in two days.
        </div>

        {/* FOOTER : Date et Heure */}
        <div className="flex justify-end items-center gap-2 text-[10px] font-medium opacity-40 italic">
          <span>20-03-2026</span>
          <span className="w-1 h-1 bg-base-content/20 rounded-full" />
          <span>10:20</span>

        </div>
      </div>
    </div>
  );
};

export default Notification;
