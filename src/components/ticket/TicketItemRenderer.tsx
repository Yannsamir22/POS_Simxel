import ProductTicketItem from "./ProductTicketItem";
import ServiceTicketItem from "./ServiceTicketItem";
import PackageTicketItem from "./PackageTicketItem";

import type { TicketItem } from "../../stores/useTicketStore";
import { useEmployeeStore } from "../../stores/employeeStore";

const TicketItemRenderer = ({ item }: { item: TicketItem }) => {
  const { employees } = useEmployeeStore(); // Fetch employees from store

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