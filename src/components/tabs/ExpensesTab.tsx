import { Plus, Receipt } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useT } from "../../hooks/useT";
import Loading from "../../loadash/Loading";
import { useExpenseStore } from "../../stores/expenseStore";
import { useToastStore } from "../../stores/toastStore";
import ExpenseForm from "../forms/ExpenseForm";

const ExpensesTab: React.FC = () => {
  const { t } = useT();
  const addToast = useToastStore((s: any) => s.addToast);
  const { expenses, fetchExpenses, addExpense, loading } = useExpenseStore();
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  if (loading) return <Loading message={t("common.loading")} />;

  const todayTotal = expenses
    .filter((e) => {
      const d = new Date(e.date);
      const n = new Date();
      return d.toDateString() === n.toDateString();
    })
    .reduce((s, e) => s + e.amount, 0);


  const handleSubmit = async (data: {
    type: string;
    amount: number;
    note?: string;
    date: string;
  }) => {
    const result = await addExpense(data);
    if (result.success) {
      addToast(t("expenses.added"), "success");
      setFormOpen(false);
    } else {
      addToast(result.error ?? t("common.error"), "error");
    }
    return result;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center px-6 border-b border-base-300 py-4">
        <div>
          <h1 className="uppercase tracking-tighter font-extrabold">
            {t("nav.expenses")}
          </h1>
          {todayTotal > 0 && (
            <p className="text-[10px] opacity-50 font-bold">
              {t("dashboard.period.today")}: {todayTotal.toLocaleString()} FCFA
            </p>
          )}
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="btn btn-error btn-sm rounded-sm font-bold uppercase text-[10px] tracking-widest gap-2"
        >
          <Plus size={14} /> {t("expenses.addExpense")}
        </button>
      </div>

      {/* Empty state */}
      {expenses.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center opacity-20 gap-3">
          <Receipt size={48} />
          <p className="font-black uppercase tracking-widest text-sm">
            {t("expenses.noExpenses")}
          </p>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto px-25 py-6 space-y-2">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex justify-between items-center p-3 bg-base-200 rounded-md border border-base-300"
          >
            <div className="flex flex-col">
              <span className="font-bold text-sm uppercase">
                {String(t(`expenses.types.${expense.type}`, { defaultValue: expense.type } as any))}
              </span>
              {expense.note && (
                <span className="text-xs opacity-50">{expense.note}</span>
              )}
              <span className="text-[10px] opacity-40 font-mono">
                {new Date(expense.date).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <span className="font-black text-error italic">
              {expense.amount.toLocaleString()} FCFA
            </span>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ExpenseForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initial={null}
      />
    </div>
  );
};

export default ExpensesTab;