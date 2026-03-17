import { Calendar, Edit2, Plus, Receipt, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useT } from "../../hooks/useT";
import Loading from "../../loadash/Loading";
import type { Expense } from "../../stores/expenseStore";
import { useExpenseStore } from "../../stores/expenseStore";
import { useToastStore } from "../../stores/toastStore";
import ExpenseForm from "../forms/ExpenseForm";

const ExpenseManagement: React.FC = () => {
  const { t } = useT();
  const addToast = useToastStore((s: any) => s.addToast);

  const {
    expenses,
    fetchExpenses,
    addExpense,
    editExpense,
    removeExpense,
    loading,
  } = useExpenseStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  if (loading) return <Loading message="Loading Expenses..." />;

  const totalAll = expenses.reduce((s, e) => s + e.amount, 0);
  const now = new Date();
  const totalThisMonth = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((s, e) => s + e.amount, 0);

  const handleSubmit = async (data: {
    type: string;
    amount: number;
    note?: string;
    date: string;
  }) => {
    if (editTarget) return await editExpense(editTarget.id, data);

    return await addExpense(data);
  };

    const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await removeExpense(deleteTarget.id);
    setDeleting(false);
    if (result.success) {
      addToast("Expense deleted", "success");
      setDeleteTarget(null);
    } else {
      addToast(result.error ?? "Failed to delete", "error");
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-base-200 p-6 rounded-xl border-2 border-base-300 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-error/10 rounded-xl text-error border border-error/20">
            <Receipt size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase opacity-50 tracking-[0.2em]">
              {t("expenses.totalExpenses")}
            </p>
            <p className="text-3xl font-black text-error leading-none mt-1">
              {totalAll.toLocaleString()}{" "}
              <span className="text-xs uppercase">FCFA</span>
            </p>
          </div>
        </div>
        <div className="bg-base-200 p-6 rounded-xl border border-base-300 flex items-center gap-5">
          <div className="p-4 bg-primary/10 rounded-xl text-primary border border-primary/20">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase opacity-50 tracking-[0.2em]">
              {t("expenses.thisMonth")}
            </p>
            <p className="text-2xl font-black">
              {totalThisMonth.toLocaleString()}{" "}
              <span className="text-xs">FCFA</span>
            </p>
          </div>
        </div>
      </div>

      {/* JOURNAL TABLE */}
      <div className="bg-base-200 rounded-2xl shadow-2xl border-2 border-base-300 overflow-hidden">
        <div className="p-6 border-b border-base-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="border-l-4 border-error pl-6">
            <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight">
              {t("expenses.title")}
            </h3>
            <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-[0.3em]">
              {t("expenses.subtitle")}
            </p>
          </div>
          <button
            onClick={() => {
              setEditTarget(null);
              setFormOpen(true);
            }}
            className="btn btn-error btn-md rounded-lg font-black gap-3 uppercase text-xs tracking-widest shadow-lg shadow-error/20"
          >
            <Plus size={20} /> {t("expenses.addExpense")}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-300/30">
              <tr className="text-[10px] uppercase tracking-widest opacity-60">
                <th className="py-4 pl-8">{t("common.date")}</th>
                <th>{t("common.type")}</th>
                <th>{t("common.note")}</th>
                <th className="text-right"> {t("common.amount")}</th>
                <th className="text-right pr-6">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300/50">
              {expenses.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 opacity-20 font-black uppercase tracking-widest text-sm"
                  >
                    {t("expenses.noExpenses")}
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-base-300/20 transition-colors group"
                  >
                    <td className="py-4 pl-8 font-mono text-xs">
                      {new Date(expense.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="font-bold uppercase text-sm">
                      {String(t(`expenses.types.${expense.type}`, { defaultValue: expense.type } as any))}
                    </td>
                    <td>
                      <span className="badge badge-outline border-base-300 text-[10px] font-black uppercase px-3">
                        {expense.note || "—"}
                      </span>
                    </td>
                    <td className="text-right font-black text-error">
                      {expense.amount.toLocaleString()} FCFA
                    </td>
                    <td className="text-right pr-6 space-x-1">
                      <button
                        onClick={() => {
                          setEditTarget(expense);
                          setFormOpen(true);
                        }}
                        className="btn btn-ghost btn-xs hover:text-primary"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(expense)}
                        className="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <ExpenseForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleSubmit}
        initial={editTarget}
      />
    
     {/* Delete confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-sm mx-4 p-6 flex flex-col items-center gap-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 rounded-full bg-error/10 text-error"><Trash2 size={28} /></div>
            <div>
              <p className="font-black text-base uppercase tracking-tight">{t("common.delete")}?</p>
              <p className="text-sm text-base-content/60 mt-1">
                <span className="font-bold text-base-content">
                  {String(t(`expenses.types.${deleteTarget.type}`, { defaultValue: deleteTarget.type } as any))}
                </span>{" "}
                — {deleteTarget.amount.toLocaleString()} FCFA
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="btn btn-ghost flex-1 rounded-lg font-bold">
                {t("common.cancel")}
              </button>
              <button onClick={handleDelete} disabled={deleting} className="btn btn-error flex-1 rounded-lg font-bold">
                {deleting ? <span className="loading loading-spinner loading-xs" /> : <><Trash2 size={14} /> {t("common.delete")}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManagement;
