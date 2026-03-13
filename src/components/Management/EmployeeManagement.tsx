import { Edit2, Plus, Trash2 } from "lucide-react";

const EmployeeManagement = () => {
  const loading = false;
  if (loading)
    return (
      <div className="h-full w-full flex flex-col items-center justify-center  bg-base-100">
        <span className="loading loading-ball loading-lg text-accent"></span>
        <p className="font-black uppercase tracking-[0.4em] text-[10px] opacity-50">
          Charging Employees...
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="bg-base-200 rounded-md shadow-xl border border-base-300 overflow-hiden relative">
        <div className="p-6 border-b border-base-300 flex justify-between items-center relative">
          <div className="absolute left-4 top-8 bottom-8 w-px bg-primary" />
          <div className="pl-6">
            <h3 className="text-xl font-black uppercase tracking-tighter">
              Employees
            </h3>
            <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-[0.3em">
              Profil Management
            </p>
          </div>
          <button className="btn btn-primary btn-sm rounded-sm font-bold uppercase text-[10px] tracking-widest">
            <Plus size={16} />
            Add
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-300/50 border-b border-base-300">
                <th className="text-[10px] uppercase tracking-widest opacity-50 pl-10">
                  Employee
                </th>
                <th className="text-right text-[10px] uppercase tracking-widest opacity-50 pr-6">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {[
                { id: 1, name: "yann" },
                { id: 2, name: "samir" },
              ].map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-base-300/30 border-b border-base-300/50 group"
                >
                  <td className="pl-10 mb-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm uppercase tracking-tight">
                        {emp.name}
                      </span>
                      <span className="text-[9px] opacity-40 font-bold u]ercase italic">
                        Test
                      </span>
                    </div>
                  </td>
                  <td className="text-right pr-6 space-x-2">
                    <button className="btn btn-ghost btn-xs rounded-4xl p-1 hover:text-primary transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button className="btn btn-ghost btn-xs rounded-4xl p-1 hover:text-error transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
