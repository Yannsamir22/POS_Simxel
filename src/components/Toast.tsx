import { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import { useToastStore } from "../stores/toastStore";

// Single toast 
interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration: number;
}

const CONFIGS = {
  success: {
    icon:    <CheckCircle  size={16} />,
    classes: "bg-success/10 text-success border-success/30",
  },
  error: {
    icon:    <AlertCircle  size={16} />,
    classes: "bg-error/10 text-error border-error/30",
  },
  warning: {
    icon:    <AlertTriangle size={16} />,
    classes: "bg-warning/10 text-warning border-warning/30",
  },
  info: {
    icon:    <Info         size={16} />,
    classes: "bg-info/10 text-info border-info/30",
  },
};

const ToastItem: React.FC<{ toast: ToastItem }> = ({ toast }) => {
  const removeToast = useToastStore((s: any) => s.removeToast);
  const cfg = CONFIGS[toast.type] ?? CONFIGS.info;

  // Auto-dismiss
  useEffect(() => {
    if (toast.duration <= 0) return;
    const t = setTimeout(() => removeToast(toast.id), toast.duration);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, removeToast]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg
        text-sm font-bold min-w-72 max-w-sm
        animate-in fade-in slide-in-from-right-4 duration-200
        ${cfg.classes}`}
    >
      <span className="mt-0.5 shrink-0">{cfg.icon}</span>
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity mt-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
};


const Toast: React.FC = () => {
  const toasts = useToastStore((s: any) => s.toasts) as ToastItem[];

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
};

export default Toast;