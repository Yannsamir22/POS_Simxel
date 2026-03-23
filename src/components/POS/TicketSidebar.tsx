import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
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
import { useToastStore } from "../../stores/toastStore";

const PAYMENT_METHODS = [
  { label: "Cash", method: "CASH" },
  { label: "OM",   method: "OM" },
  { label: "MoMo", method: "MOMO" },
  { label: "Card", method: "CARD" },
] as const;

// ─── Receipt Modal ────────────────────────────────────────────────────────────
interface ReceiptModalProps {
  receiptFileName: string | null; // null = sale OK but no receipt file
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ receiptFileName, onClose }) => {
  const { openFile, printReceipt, isElectron } = useElectronFiles();
  const addToast = useToastStore((s: any) => s.addToast);
  const { t } = useT();

  const [printing, setPrinting] = useState(false);
  const [opening,  setOpening]  = useState(false);
  const busy = printing || opening;

  const handleOpen = async () => {
    if (!receiptFileName) return;
    setOpening(true);
    const result = await openFile(receiptFileName);
    setOpening(false);
    if (!result.ok) addToast(t("receipt.openError"), "error");
  };

  const handlePrint = async (silent: boolean) => {
    if (!receiptFileName) return;
    setPrinting(true);
    const result = await printReceipt(receiptFileName, silent);
    setPrinting(false);
    if (result.ok) {
      addToast(t("receipt.printSent"), "success");
      onClose();
    } else {
      addToast(t("receipt.printError"), "error");
    }
  };

  return (
    /* Backdrop — click outside the card to dismiss */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Card */}
      <div
        className="bg-base-100 border border-base-300 rounded-2xl shadow-2xl p-6 w-80 flex flex-col gap-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-success" />
            <h3 className="font-black text-base">{t("receipt.saleConfirmed")}</h3>
          </div>
          {/* X is always present */}
          <button
            onClick={onClose}
            className="btn btn-ghost btn-xs btn-circle"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Sub-text ── */}
        <p className="text-xs text-base-content/60 -mt-2">
          {receiptFileName
            ? t("receipt.receiptGenerated")
            : t("receipt.noReceipt")}
        </p>

        {/* ── Receipt actions (only when a file exists) ── */}
        {receiptFileName && (
          isElectron ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleOpen}
                disabled={busy}
                className="btn btn-outline btn-sm gap-2 w-full"
              >
                {opening
                  ? <span className="loading loading-spinner loading-xs" />
                  : <ExternalLink size={14} />}
                {opening ? t("receipt.opening") : t("receipt.openReceipt")}
              </button>

              <button
                onClick={() => handlePrint(false)}
                disabled={busy}
                className="btn btn-primary btn-sm gap-2 w-full"
              >
                {printing
                  ? <span className="loading loading-spinner loading-xs" />
                  : <Printer size={14} />}
                {printing ? t("receipt.printing") : t("receipt.print")}
              </button>

              <button
                onClick={() => handlePrint(true)}
                disabled={busy}
                className="btn btn-ghost btn-xs gap-1 w-full opacity-60"
              >
                <Printer size={12} />
                {t("receipt.printDirect")}
              </button>
            </div>
          ) : (
            <a
              href={receiptFileName}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-sm gap-2 w-full"
            >
              <ExternalLink size={14} />
              {t("receipt.openReceipt")}
            </a>
          )
        )}

        {/* ── Bottom close — always shown, label adapts ── */}
        <button
          onClick={onClose}
          disabled={busy}
          className="btn btn-ghost btn-sm w-full font-bold"
        >
          {receiptFileName ? t("receipt.closeWithoutPrinting") : t("common.confirm")}
        </button>
      </div>
    </div>
  );
};

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
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
  const addToast = useToastStore((s: any) => s.addToast);

  const [paymentAmounts, setPaymentAmounts] = useState<Record<string, number>>({
    CASH: 0, OM: 0, MOMO: 0, CARD: 0,
  });
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [confirming,   setConfirming]   = useState(false);

  /**
   * modalState:
   *   undefined  → modal hidden
   *   null       → modal open, sale ok, receipt generation failed
   *   "file.pdf" → modal open, sale ok, receipt ready
   */
  const [modalState, setModalState] = useState<string | null | undefined>(undefined);

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

    clearPayments();
    Object.entries(paymentAmounts).forEach(([method, amount]) => {
      if (amount > 0)
        addPayment({ method: method as "CASH" | "OM" | "MOMO" | "CARD", amount });
    });

    const result = await confirmTicket();
    setConfirming(false);

    if (result.success) {
      resetPayments();
      // Open receipt modal — modal is the feedback, no extra toast
      setModalState(result.receiptPath ?? null);
    } else {
      const msg = result.error ?? t("common.error");
      setConfirmError(msg);
      addToast(msg, "error");
    }
  };

  return (
    <>
      {modalState !== undefined && (
        <ReceiptModal
          receiptFileName={modalState}
          onClose={() => setModalState(undefined)}
        />
      )}

      <aside className="fixed inset-y-0 right-0 w-full sm:w-96 bg-base-100 border-l border-base-300 flex flex-col shadow-2xl mt-16">

        {/* ── HEADER ── */}
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
                title={t("ticket.parkTicket")}
              >
                <ChevronLeft size={14} />
              </button>
              <button className="btn btn-xs btn-circle btn-ghost" disabled>
                <ChevronRight size={14} />
              </button>
              <button
                onClick={() => { clearTicket(); resetPayments(); }}
                className="btn btn-xs btn-circle btn-ghost text-primary"
                title={t("ticket.newTicket")}
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

        {/* ── ITEM LIST ── */}
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

        {/* ── PAYMENT FOOTER ── */}
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

          {confirmError && (
            <p className="text-error text-xs font-bold text-center mb-2">
              {confirmError}
            </p>
          )}

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