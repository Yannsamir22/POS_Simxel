import { Trash2 } from "lucide-react";
import { useTicketStore } from "../../stores/useTicketStore";
import type { TicketItem } from "../../stores/useTicketStore";
import type { Employee } from "../../stores/employeeStore";
import { useT } from "../../hooks/useT";

const PackageTicketItem = ({ item, employees }: { item: TicketItem; employees: Employee[] }) => {
  const { removeItem, assignPackageEmployee } = useTicketStore();
  const { t } = useT();

  return (
    <div className="group flex flex-col p-3 rounded-xl bg-base-200 border border-base-300/50">
      <div className="flex justify-between items-start">
        <span className="font-bold text-sm leading-tight max-w-[60%]">{item.name}</span>
        <span className="font-mono font-black text-primary text-sm">
          {item.price.toLocaleString()} FCFA
        </span>
      </div>

      {/* Per-service employee assignment */}
      <div className="space-y-2 mt-2">
        {item.services?.map((service) => (
          <div key={service.serviceId} className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase opacity-50 tracking-wider">
              {service.name}
            </span>
            <select
              value={service.employeeId || ""}
              onChange={(e) => assignPackageEmployee(item.id, service.serviceId, e.target.value)}
              className={`select select-xs w-full ${!item.employeeId ? "select-error border-error" : ""}`}
            >
              {/* fix: was hardcoded "Choose employee" */}
              <option value="">{t("pos.chooseEmployee")}</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-2">
        <button
          onClick={() => removeItem(item.id)}
          className="btn btn-xs btn-ghost text-error opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default PackageTicketItem;