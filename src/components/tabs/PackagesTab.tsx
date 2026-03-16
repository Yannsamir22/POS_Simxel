import { Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import Loading from "../../loadash/Loading";
import { usePackageStore } from "../../stores/packageStore";
import { useTicketStore } from "../../stores/useTicketStore";
import SearchBar from "../SearchBar";

const PackagesTab: React.FC = () => {
  const { packages, fetchPackages, loading } = usePackageStore();
  const addItem = useTicketStore((state) => state.addItem);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const filteredPackages = packages.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <Loading message="Loading Packages..." />;
  }
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-10 border-b border-base-300 py-4">
        <h1 className="uppercase tracking-tighter font-extrabold">
          Package Sale
        </h1>
        {/* Search bar */}
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search packages..."
        />
      </div>

      {/* Empty state */}
      {filteredPackages.length === 0 && (
        <div className="flex-1 flex items-center justify-center opacity-30">
          <p className="font-black uppercase tracking-widest text-sm">
            {search ? "No results" : "No packages yet"}
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-10">
        {filteredPackages.map((p) => (
          <div
            key={p.id}
            onClick={() =>
              addItem({
                id: p.id,
                name: p.name,
                price: p.price,
                type: "PACKAGE",
                quantity: 1,

                services: p.services.map((s) => ({
                  serviceId: s.serviceId,
                  name: s.name,
                  price: s.price,
                  employeeId: undefined,
                })),
              })
            }
            className="p-4 bg-base-200 rounded-xl hover:bg-primary/20 cursor-pointer flex justify-between items-center"
          >
            <div className="flex justify-between items-start">
              <span className="font-bold text-sm uppercase tracking-tight">
                {p.name}
              </span>
              <span className="font-black text-primary italic text-sm">
                {p.price.toLocaleString()} FCFA
              </span>
            </div>

            {/* Service in package */}
            {p.services.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {p.services.map((s) => (
                  <span
                    key={s.serviceId}
                    className="flex items-center gap-1 text-[10px] font-bold bg-base-300 px-2 py-0.5 rounded-full"
                  >
                    <Check size={9} className="text-primary" />
                    {s.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackagesTab;
