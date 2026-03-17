import React, { useEffect, useState } from "react";
import { useT } from "../../hooks/useT";
import Loading from "../../loadash/Loading";
import { useServiceStore } from "../../stores/serviceStore";
import { useTicketStore } from "../../stores/useTicketStore";
import SearchBar from "../SearchBar";
const ServicesTab: React.FC = () => {
  const { t } = useT();
  const { services, fetchServices, loading } = useServiceStore();
  const addItem = useTicketStore((state) => state.addItem);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <Loading message={t("common.loading")} />;
  }
  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="flex justify-between items-center px-6 border-b border-base-300 py-4">
        <h1 className="uppercase tracking-tighter font-extrabold">
          {t("pos.serviceSale")}
        </h1>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={t("pos.searchServices")}
        />
      </div>
      {/* Empty state */}
      {filteredServices.length === 0 && (
        <div className="flex-1 flex items-center justify-center opacity-30">
          <p className="font-black uppercase tracking-widest text-sm">
            {search ? "No results" : "No services yet"}
          </p>
        </div>
      )}

      {/* Service List */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-15">
        {filteredServices.map((s) => (
          <div
            key={s.id}
            onClick={() =>
              addItem({
                id: s.id,
                name: s.name,
                price: s.price,
                type: "SERVICE",
                quantity: 1,
              })
            }
            className="p-4 bg-base-200 rounded-xl hover:border-primary hover:bg-primary/20 cursor-pointer flex active:scale-95 transition-all justify-between items-center"
          >
            <span className="font-bold text-sm uppercase tracking-tight">
              {s.name}
            </span>
            <span className="font-black text-primary italic text-sm">
              {s.price.toLocaleString()} FCFA
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesTab;
