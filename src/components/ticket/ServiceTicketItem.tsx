import { Trash2 } from "lucide-react";
import { useTicketStore } from "../../stores/useTicketStore";
import type { TicketItem } from "../../stores/useTicketStore";
import type { Employee } from "../../stores/employeeStore";

const ServiceTicketItem = ({ item, employees }: { item: TicketItem; employees: Employee[] }) => {

  const { removeItem, assignEmployee } = useTicketStore();

  return (
    <div className="group flex flex-col p-3 rounded-2xl bg-base-200 border border-base-300/50">

      <div className="flex justify-between items-start">

        <span className="font-bold text-sm">{item.name}</span>

        <div className="text-right">
          <span className="font-mono font-bold">
            {item.price.toLocaleString()} FCFA
          </span>
        </div>

      </div>

      <select
        value={item.employeeId || ""}
        onChange={(e) =>
          assignEmployee(item.id, e.target.value)
        }
        className="select select-xs mt-2"
      >
        <option value="">Choose employee</option>

        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.name}
          </option>
        ))}
      </select>

      <div className="flex justify-end mt-2">
        <button
          onClick={() => removeItem(item.id)}
          className="p-1 text-error opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>

    </div>
  );
};

export default ServiceTicketItem;