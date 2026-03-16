import { Edit2, Plus, Trash2 } from "lucide-react";
import Loading from "../../loadash/Loading";
import { useServiceStore } from "../../stores/serviceStore";

const ServiceManagement = () => {
  const { services, fetchServices, loading } = useServiceStore();
  if (loading) return <Loading message="Loading services..." />;

  return (
    <div className="space-y-6">
      <div className="bg-base-200 rounded-md shadow-xl border border-base-300 overflow-hidden animate-in fade-in duration-500">
        <div className="p-6 border-b border-base-300 flex justify-between items-center relative">
          <div className="absolute left-4 top-8 bottom-8 w-px bg-primary" />
          <div className="pl-6">
            <h3 className="text-xl font-black uppercase tracking-tighter">
              Service Panel
            </h3>
            <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-[0.3em]">
              Service Management
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm rounded-sm font-bold gap-2 uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20"
          >
            <Plus size={16} /> Add service
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-300/50 border-b border-base-300 text-[10px] uppercase tracking-widest opacity-50">
                <th className="pl-10">Name</th>
                <th className="text-center">Price</th>
                <th className="text-right pr-10">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="hover:bg-base-300/30 transition-colors border-b border-base-300/50"
                >
                  <td className="pl-10 font-bold text-sm uppercase tracking-tight">
                    {service.name}
                  </td>
                  <td className="pl-10 justify-center flex font-bold text-sm uppercase tracking-tight ">
                    {service.price} FCFA
                  </td>
                  
                  <td className="text-right pr-10 space-x-2">
                    <button className="btn btn-ghost btn-xs hover:text-primary">
                      <Edit2 size={14} />
                    </button>
                    <button className="btn btn-ghost btn-xs hover:text-error">
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

export default ServiceManagement;
