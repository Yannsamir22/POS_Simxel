// src/components/POS/TicketSidebar.tsx
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  ExternalLink,
  Printer,
  PlusSquare,
  X,
} from "lucide-react";
import { useState } from "react";
import { useElectronFiles } from "../../hooks/useElectronFiles";
import { useTicketStore } from "../../stores/useTicketStore";
import TicketItemRenderer from "../ticket/TicketItemRenderer";
import { useT } from "../../hooks/useT";

const PAYMENT_METHODS = [
  { label: "Cash", method: "CASH" },
  { label: "OM",   method: "OM" },
  { label: "MoMo", method: "MOMO" },
  { label: "Card", method: "CARD" },
] as const;

//  Receipt Modal ─
interface ReceiptModalProps {
  receiptPath: string;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ receiptPath, onClose }) => {
  const { openFile, printReceipt, isElectron } = useElectronFiles();
  const [printing, setPrinting] = useState(false);
  const [opening, setOpening]   = useState(false);

  const handleOpen = async () => {
    setOpening(true);
    await openFile(receiptPath);
    setOpening(false);
  };

  const handlePrint = async () => {
    setPrinting(true);
    await printReceipt(receiptPath, false); // false = show print dialog
    setPrinting(false);
  };

  const handleSilentPrint = async () => {
    setPrinting(true);
    await printReceipt(receiptPath, true); // true = silent, no dialog
    setPrinting(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-2xl p-6 w-80 flex flex-col gap-4 animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-success" />
            <h3 className="font-black text-base">Vente confirmée !</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-xs btn-circle">
            <X size={14} />
          </button>
        </div>

        <p className="text-xs opacity-60 -mt-2">
          Le reçu a été généré avec succès.
        </p>

        {/* Actions */}
        {isElectron ? (
          <div className="flex flex-col gap-2">
            {/* Open in PDF viewer */}
            <button
              onClick={handleOpen}
              disabled={opening}
              className="btn btn-outline btn-sm gap-2 w-full"
            >
              {opening
                ? <span className="loading loading-spinner loading-xs" />
                : <ExternalLink size={14} />
              }
              Ouvrir le reçu
            </button>

            {/* Print with dialog */}
            <button
              onClick={handlePrint}
              disabled={printing}
              className="btn btn-primary btn-sm gap-2 w-full"
            >
              {printing
                ? <span className="loading loading-spinner loading-xs" />
                : <Printer size={14} />
              }
              Imprimer
            </button>

            {/* Silent print */}
            <button
              onClick={handleSilentPrint}
              disabled={printing}
              className="btn btn-ghost btn-xs gap-1 w-full opacity-60"
            >
              <Printer size={12} />
              Impression directe (sans dialogue)
            </button>
          </div>
        ) : (
          // Web fallback — open receipt URL directly
          <a
            href={receiptPath}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-sm gap-2 w-full"
          >
            <ExternalLink size={14} />
            Ouvrir le reçu
          </a>
        )}

        {/* Dismiss */}
        <button
          onClick={onClose}
          className="btn btn-ghost btn-xs text-xs opacity-50 w-full"
        >
          Fermer sans imprimer
        </button>
      </div>
    </div>
  );
};

//  Main Sidebar 
const TicketSidebar = () => {
  const {
    currentTicket,
    clearTicket,
    confirmTicket,
    addPayment,
    clearPayments,
    parkTicket,
    pendingTickets,
    loadTicket,
  } = useTicketStore();

  const { t } = useT();

  const [paymentAmounts, setPaymentAmounts] = useState<Record<string, number>>({
    CASH: 0, OM: 0, MOMO: 0, CARD: 0,
  });
  const [confirmError,  setConfirmError]  = useState<string | null>(null);
  const [confirming,    setConfirming]    = useState(false);
  const [receiptPath,   setReceiptPath]   = useState<string | null>(null);

  const enteredTotal = Object.values(paymentAmounts).reduce((s, v) => s + v, 0);
  const remaining    = currentTicket.total - enteredTotal;

  const resetPayments = () => {
    setPaymentAmounts({ CASH: 0, OM: 0, MOMO: 0, CARD: 0 });
    clearPayments();
    setConfirmError(null);
  };

  const handleConfirm = async () => {
    if (currentTicket.items.length === 0) return;

    setConfirmError(null);
    setConfirming(true);

    // Push payment entries into the store
    clearPayments();
    Object.entries(paymentAmounts).forEach(([method, amount]) => {
      if (amount > 0)
        addPayment({ method: method as "CASH" | "OM" | "MOMO" | "CARD", amount });
    });

    const result = await confirmTicket();

    if (result.success) {
      resetPayments();
      // Show receipt modal only if the backend returned a path
      if (result.receiptPath) {
        setReceiptPath(result.receiptPath);
      }
    } else {
      setConfirmError(result.error ?? "Sale failed");
    }

    setConfirming(false);
  };

  return (
    <>
      {/* Receipt modal — shown after a successful sale */}
      {receiptPath && (
        <ReceiptModal
          receiptPath={receiptPath}
          onClose={() => setReceiptPath(null)}
        />
      )}

      <aside className="fixed inset-y-0 right-0 w-full sm:w-96 bg-base-100 border-l border-base-300 flex flex-col shadow-2xl mt-16">

        {/*  HEADER  */}
        <div className="p-4 bg-base-200 border-b border-base-300">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-black italic text-primary tracking-tighter uppercase">
              {t("ticket.title")}
              {pendingTickets.length > 0 && (
                <span className="ml-2 badge badge-primary badge-sm">
                  +{pendingTickets.length}
                </span>
              )}
            </h2>
            <div className="flex gap-1">
              {pendingTickets.map((_, i) => (
                <button
                  key={i}
                  onClick={() => loadTicket(i)}
                  className="btn btn-xs btn-circle btn-ghost font-bold text-primary"
                  title={`Load parked ticket ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={parkTicket}
                className="btn btn-xs btn-circle btn-ghost"
                title="Park current ticket"
              >
                <ChevronLeft size={14} />
              </button>
              <button className="btn btn-xs btn-circle btn-ghost" disabled>
                <ChevronRight size={14} />
              </button>
              <button
                onClick={() => { clearTicket(); resetPayments(); }}
                className="btn btn-xs btn-circle btn-ghost text-primary"
                title="New ticket"
              >
                <PlusSquare size={14} />
              </button>
            </div>
          </div>

          {/* Running total */}
          <div className="flex justify-between items-center bg-base-100 p-2 rounded-xl border border-base-300 shadow-inner">
            <span className="text-xs font-bold opacity-50 uppercase">
              {t("ticket.total")}
            </span>
            <span className="text-xl font-black text-primary">
              {currentTicket.total.toLocaleString()}{" "}
              <span className="text-xs">FCFA</span>
            </span>
          </div>
        </div>

        {/*  ITEM LIST  */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {currentTicket.items.length === 0 ? (
            <p className="text-center text-xs opacity-30 font-bold uppercase tracking-widest mt-8">
              {t("ticket.noItems")}
            </p>
          ) : (
            currentTicket.items.map((item) => (
              <TicketItemRenderer key={`${item.id}-${item.type}`} item={item} />
            ))
          )}
        </div>

        {/*  PAYMENT FOOTER  */}
        <div className="p-3 bg-base-200 border-t border-base-300 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
          <h3 className="text-[10px] font-black uppercase opacity-40 mb-3 tracking-widest text-center">
            {t("ticket.payment")}
          </h3>

          <div className="grid grid-cols-2 gap-1 mb-2">
            {PAYMENT_METHODS.map(({ label, method }) => (
              <label
                key={method}
                className="flex items-center justify-between p-3 rounded-md border border-base-300 bg-base-100 hover:border-primary cursor-pointer transition-all group"
              >
                <span className="text-xs font-bold opacity-70 mr-2 group-hover:opacity-100">
                  {label}
                </span>
                <input
                  type="number"
                  min={0}
                  value={paymentAmounts[method] || ""}
                  onChange={(e) => {
                    const amount = parseFloat(e.target.value) || 0;
                    setPaymentAmounts((prev) => ({ ...prev, [method]: amount }));
                    setConfirmError(null);
                  }}
                  className="input input-xs input-ghost text-lg w-20 text-right"
                  placeholder="0"
                />
              </label>
            ))}
          </div>

          {/* Remaining indicator */}
          {currentTicket.total > 0 && (
            <div
              className={`text-xs font-bold text-center mb-2 ${
                remaining > 0
                  ? "text-warning"
                  : remaining < 0
                  ? "text-error"
                  : "text-success"
              }`}
            >
              {remaining > 0
                ? `${t("ticket.remaining")}: ${remaining.toLocaleString()} FCFA`
                : remaining < 0
                ? `${t("ticket.overpaid")}: ${Math.abs(remaining).toLocaleString()} FCFA`
                : t("ticket.exact")}
            </div>
          )}

          {/* Error */}
          {confirmError && (
            <p className="text-error text-xs font-bold text-center mb-2">
              {confirmError}
            </p>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { clearTicket(); resetPayments(); }}
              className="btn btn-ghost btn-md rounded-md uppercase font-bold text-error border border-error/20 hover:bg-error/10"
            >
              {t("ticket.cancel")}
            </button>
            <button
              onClick={handleConfirm}
              disabled={
                confirming ||
                currentTicket.items.length === 0 ||
                enteredTotal === 0
              }
              className="btn btn-primary rounded-md uppercase font-bold shadow-lg shadow-primary/30"
            >
              {confirming ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                t("ticket.confirm")
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default TicketSidebar;