import { Plus, Receipt } from "lucide-react";

const ExpenseManagement = () => {
  const loading = false;
  if (loading)
    return (
      <div className="h-full w-full flex flex-col items-center justify-center  bg-base-100">
        <span className="loading loading-ball loading-lg text-accent"></span>
        <p className="font-black uppercase tracking-[0.4em] text-[10px] opacity-50">
          Charging Expenses...
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-base-200 p-4 rounded-md border border-base-300 flex items-center gap-4">
          <div className="p-3 bg-error/10 rounded-full text-error">
            <Receipt size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">
              Total Expenses
            </p>
            <p className="text-xl font-black text-error">20000 FCFA</p>
          </div>
        </div>
      </div>
      <div className="bg-base-200 rounded-md shadow-xl border border-base-300 overflow-hidden animate-in fade-in">
        {/* Table Header */}
        <div className="p-6 border-b border-base-300 flex justify-between items-center relative">
          <div className="absolute left-4 top-8 bottom-8 w-px bg-error">
            <div className="pl-6">
              <h3 className="text-xl font-black uppercase tracking-tighter">
                Expenses Journal
              </h3>
              <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-[0.3em">
                Real cashOut
              </p>
              <button className="btn btn-error btn-sm rounded-sm font-bold gap-2 uppercase text-[10px] tracking-widest text-base-content shadow-lg shadow-error/20">
                <Plus size={16} />
                New Expense
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManagement;
