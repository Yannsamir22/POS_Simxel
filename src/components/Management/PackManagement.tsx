import { Check, Edit2, Plus, Trash2 } from "lucide-react";
import Loading from "../../loadash/Loading";
import { usePackageStore } from "../../stores/packageStore";
import { useEffect } from "react";

const PackManagement = () => {
  const {packages, fetchPackages, loading} = usePackageStore();

  useEffect(() => {
    fetchPackages();
  }, [])
  if (loading)
    return (
      <Loading message="Loading Packages..." />
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="bg-base-200 p-6 rounded-md border border-base-300 flex justify-between items-center shadow-lg">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic text-primary">
            Package & Offers
          </h3>
          <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.3em]">
            Combined offers Management
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm rounded-none font-bold gap-2 uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20"
        >
          <Plus size={16} /> Add Package
        </button>
      </div>

      {/* GRILLE DES Package */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-base-200 border border-base-300 rounded-md overflow-hidden hover:border-primary/50 transition-all group shadow-sm"
          >
            <div className="p-5 border-b border-base-300 flex justify-between items-start bg-base-300/30">
              <h4 className="font-black uppercase text-sm tracking-tight">
                {pkg?.name}
              </h4>
              <span className="text-primary font-black text-sm italic">
                {pkg?.price?.toLocaleString()} FCFA
              </span>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-[9px] font-bold uppercase opacity-40 tracking-widest">
                Included Services :
              </p>
              <div className="flex flex-wrap gap-2">
                {/* CORRECTION DU MAPPING ICI : pkg.items -> item.service.nom */}
                {pkg?.services && pkg?.services.length > 0 ? (
                  pkg?.services.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 bg-base-300 px-2 py-1 rounded-sm border border-base-100"
                    >
                      <Check size={10} className="text-primary" />
                      <span className="text-[10px] font-bold uppercase">
                        {item?.name || "Service Inconnu"}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-[10px] italic opacity-30">
                    No linked services
                  </span>
                )}
              </div>
            </div>

            <div className="p-2 bg-base-300/10 flex justify-end">
              <button
                className="btn btn-ghost btn-xs rounded-sm hover:text-primary transition-colors"
              >
                <Edit2 size={14} />
              </button>
              <button
                className="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default PackManagement;
