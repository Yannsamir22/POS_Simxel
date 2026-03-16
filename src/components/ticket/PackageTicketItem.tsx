import { Trash2 } from "lucide-react";
import { useTicketStore } from "../../stores/useTicketStore";
import type { TicketItem } from "../../stores/useTicketStore";
import type { Employee } from "../../stores/employeeStore";

const PackageTicketItem = ({ item, employees }: { item: TicketItem; employees: Employee[] }) => {
  const { removeItem, assignPackageEmployee } = useTicketStore();

  return (
    <div className="group flex flex-col p-3 rounded-2xl bg-base-200 border border-base-300/50">
      <div className="flex justify-between items-start">
        <span className="font-bold text-sm">{item.name}</span>
        <span className="font-mono font-bold">
          {item.price.toLocaleString()} FCFA
        </span>
      </div>
      <div className="space-y-2 mt-2">
        {item.services?.map((service) => (
          <div key={service.serviceId} className="flex flex-col">
            <span className="text-xs font-semibold">{service.name}</span>
            <select
              value={service.employeeId || ""}
              onChange={(e) =>
                assignPackageEmployee(
                  item.id,
                  service.serviceId,
                  e.target.value,
                )
              }
              className="select select-xs"
            >
              <option value="">Choose employee</option>
              {employees.map((emp) => (
                <option value={emp.id} key={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-2">
        <button
          onClick={() => removeItem(item.id)}
          className="p-1 text-error opacity-0 group-hover:opacity-100"
        >
            <Trash2 size={14}/>
        </button>
      </div>
    </div>
  );
};

export default PackageTicketItem;
