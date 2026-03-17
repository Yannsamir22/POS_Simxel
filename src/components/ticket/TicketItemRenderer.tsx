import { useEmployeeStore } from "../../stores/employeeStore";
import type { TicketItem } from "../../stores/useTicketStore";
import PackageTicketItem from "./PackageTicketItem";
import ProductTicketItem from "./ProductTicketItem";
import ServiceTicketItem from "./ServiceTicketItem";

const TicketItemRenderer = ({ item }: { item: TicketItem }) => {
  const { employees } = useEmployeeStore();

  switch (item.type) {
    case "PRODUCT":
      return <ProductTicketItem item={item} />;
    case "SERVICE":
      return <ServiceTicketItem item={item} employees={employees} />;
    case "PACKAGE":
      return <PackageTicketItem item={item} employees={employees} />;
    default:
      return null;
  }
};

export default TicketItemRenderer;
