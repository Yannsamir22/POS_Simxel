import { Loader2, Printer } from "lucide-react";
import { useState } from "react";
import { useElectronFiles } from "../hooks/useElectronFiles";
import { useToastStore } from "../stores/toastStore";

interface ReceiptPrintButtonProps {
  receiptPath: string;
  silent?: boolean;
  label?: string;
  className?: string;
  size?: "btn-xs" | "btn-sm" | "btn-md" | "btn-lg";
}

export default function ReceiptPrintButton({
  receiptPath,
  silent = false,
  label,
  className = "",
  size = "btn-sm",
}: ReceiptPrintButtonProps) {
  const { printReceipt, openFile, isElectron } = useElectronFiles();
  const addToast = useToastStore((s: any) => s.addToast);
  const [loading, setLoading] = useState(false);

  // Hide the button entirely when not in Electron
  if (!isElectron) return null;

  const handleClick = async () => {
    setLoading(true);
    try {
      const result = silent
        ? await printReceipt(receiptPath, true)
        : await openFile(receiptPath);

      if (!result.ok) {
        addToast(result.error ?? "Could not open receipt", "error");
      }
    } catch (error: any) {
      addToast(error?.message ?? "Unknown error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`btn ${size} btn-ghost gap-1.5 ${className}`}
      title={silent ? "Print receipt" : "Open receipt PDF"}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Printer size={14} />
      )}
      {label ?? (silent ? "Print" : "Open Receipt")}
    </button>
  );
}
