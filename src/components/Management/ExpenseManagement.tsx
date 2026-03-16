import { Calendar, Edit2, Plus, Receipt, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Loading from "../../loadash/Loading";
import type { Expense } from "../../stores/expenseStore";
import { useExpenseStore } from "../../stores/expenseStore";
import ExpenseForm from "../forms/ExpenseForm";

const ExpenseManagement: React.FC = () => {
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

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  if (loading) return <Loading message="Charging Expenses..." />;

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
    if (editTarget) {
      await editExpense(editTarget.id, data);
    } else {
      await addExpense(data);
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
              Total Expenses
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
              This Month
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
              Expenses Journal
            </h3>
            <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-[0.3em]">
              Real-time Cash Outflow
            </p>
          </div>
          <button
            onClick={() => {
              setEditTarget(null);
              setFormOpen(true);
            }}
            className="btn btn-error btn-md rounded-lg font-black gap-3 uppercase text-xs tracking-widest shadow-lg shadow-error/20"
          >
            <Plus size={20} /> New Expense
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-300/30">
              <tr className="text-[10px] uppercase tracking-widest opacity-60">
                <th className="py-4 pl-8">Date</th>
                <th>Type</th>
                <th>Note</th>
                <th className="text-right">Amount</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300/50">
              {expenses.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 opacity-20 font-black uppercase tracking-widest text-sm"
                  >
                    No expenses recorded
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
                      {expense.type}
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
                        onClick={async () => {
                          if (window.confirm("Delete this expense?"))
                            await removeExpense(expense.id);
                        }}
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
    </div>
  );
};

export default ExpenseManagement;
