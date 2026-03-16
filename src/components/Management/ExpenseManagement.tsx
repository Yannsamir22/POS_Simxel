import { Plus, Receipt, Calendar, Tag, Wallet } from "lucide-react";

const ExpenseManagement = () => {
  const loading = false;
  
  if (loading)
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-base-100">
        <span className="loading loading-ball loading-lg text-accent"></span>
        <p className="font-black uppercase tracking-[0.4em] text-[10px] opacity-50 mt-4">
          Charging Expenses...
        </p>
      </div>
    );

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* SUMMARY SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-base-200 p-6 rounded-xl border-2 border-base-300 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-error/10 rounded-xl text-error border border-error/20">
            <Receipt size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase opacity-50 tracking-[0.2em]">
              Total Expenses
            </p>
            <p className="text-3xl font-black text-error leading-none mt-1">
              20,000 <span className="text-xs uppercase">FCFA</span>
            </p>
          </div>
        </div>

        {/* Placeholder for extra stats (e.g., Monthly or Daily) */}
        <div className="bg-base-200 p-6 rounded-xl border border-base-300 flex items-center gap-5 opacity-80">
          <div className="p-4 bg-primary/10 rounded-xl text-primary border border-primary/20">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase opacity-50 tracking-[0.2em]">
              This Month
            </p>
            <p className="text-2xl font-black">150,000 <span className="text-xs">FCFA</span></p>
          </div>
        </div>
      </div>

      {/* MAIN JOURNAL CARD */}
      <div className="bg-base-200 rounded-2xl shadow-2xl border-2 border-base-300 overflow-hidden">
        {/* Table Header - Fixed Positioning */}
        <div className="p-8 border-b border-base-300 bg-base-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative">
          <div className="border-l-4 border-error pl-6">
            <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight">
              Expenses Journal
            </h3>
            <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-[0.3em]">
              Real-time Cash Outflow
            </p>
          </div>
          
          <button className="btn btn-error btn-md rounded-lg font-black gap-3 uppercase text-xs tracking-widest shadow-lg shadow-error/20 hover:scale-105 transition-transform">
            <Plus size={20} />
            New Expense
          </button>
        </div>

        {/* JOURNAL CONTENT AREA */}
        <div className="p-0 overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-300/30">
              <tr className="text-[10px] uppercase tracking-widest opacity-60">
                <th className="py-4 pl-8">Date</th>
                <th>Description</th>
                <th>Category</th>
                <th className="text-right pr-8">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-300/50">
              {/* Sample Row */}
              <tr className="hover:bg-base-300/20 transition-colors">
                <td className="py-5 pl-8 font-mono text-xs">15 Mar 2026</td>
                <td className="font-bold">Office Supplies</td>
                <td>
                  <span className="badge badge-outline border-base-300 text-[10px] font-black uppercase px-3">Logistics</span>
                </td>
                <td className="text-right pr-8 font-black text-error">5,000 FCFA</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Empty State Fallback (If no expenses) */}
        {/* <div className="p-20 text-center opacity-20">
           <Wallet size={64} className="mx-auto mb-4" />
           <p className="font-black uppercase tracking-widest">No transactions found</p>
        </div> 
        */}
      </div>
    </div>
  );
};

export default ExpenseManagement;