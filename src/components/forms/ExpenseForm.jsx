import { X } from "lucide-react";
import { useEffect, useState } from "react";

const EXPENSE_TYPES = [
  "Rent",
  "Electricity",
  "Water",
  "Supplies",
  "Salary",
  "Transport",
  "Maintenance",
  "Marketing",
  "Other",
];

const ExpenseForm = ({ open, onClose, onSubmit, initial }) => {
  const [type, setType] = useState(initial?.type ?? "");
  const [amount, setAmount] = useState(initial?.amount ?? "");
  const [note, setNote] = useState(initial?.note ?? "");
  const [date, setDate] = useState(
    initial?.date
      ? new Date(initial.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when the modal opens for a new expense
  useEffect(() => {
    if (open) {
      setType(initial?.type ?? "");
      setAmount(initial?.amount ?? "");
      setNote(initial?.note ?? "");
      setDate(
        initial?.date
          ? new Date(initial.date).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
      );
      setError(null);
    }
  }, [open, initial]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (!type.trim()) return setError("Please select an expense type.");
    if (isNaN(parsedAmount) || parsedAmount <= 0)
      return setError("Please enter a valid amount.");

    setLoading(true);
    try {
      await onSubmit({
        type: type.trim(),
        amount: parsedAmount,
        note: note.trim() || undefined,
        date,
      });
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.error ?? err?.message ?? "Failed to save expense.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-md mx-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-base-300 bg-base-200">
          <div className="border-l-4 border-error pl-4">
            <h3 className="font-black uppercase text-sm tracking-tight">
              {initial ? "Edit Expense" : "New Expense"}
            </h3>
            <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">
              Cash Outflow Record
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-50">
                Expense Type *
              </span>
            </label>
            <select
              className="select select-bordered w-full"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="">Select a type…</option>
              {EXPENSE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-50">
                Amount (FCFA) *
              </span>
            </label>
            <input
              type="number"
              min={1}
              step={1}
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input input-bordered w-full font-black text-lg"
              required
            />
          </div>

          {/* Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-50">
                Date *
              </span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Note (optional) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-50">
                Note (optional)
              </span>
            </label>
            <input
              type="text"
              placeholder="Add a description…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input input-bordered w-full"
              maxLength={200}
            />
          </div>

          {/* Error */}
          {error && <p className="text-error font-bold text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost flex-1 rounded-lg uppercase font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-error flex-1 rounded-lg uppercase font-bold text-xs shadow-lg shadow-error/20"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs" />
              ) : initial ? (
                "Save Changes"
              ) : (
                "Add Expense"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
