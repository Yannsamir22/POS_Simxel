import { Check, Edit2, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useT } from "../../hooks/useT";
import Loading from "../../loadash/Loading";
import { usePackageStore, type Package } from "../../stores/packageStore";
import { useServiceStore } from "../../stores/serviceStore";
import { useToastStore } from "../../stores/toastStore";
import ManagementModal, {
  PACKAGE_FIELDS,
  type ModalMode,
} from "./ManagementModal";

const PackManagement: React.FC = () => {
  const { t } = useT();
  const addToast = useToastStore((s: any) => s.addToast);

  const {
    packages,
    fetchPackages,
    addPackage,
    editPackage,
    removePackage,
    loading,
  } = usePackageStore();
  // Services must be loaded so the multiselect has options
  const { fetchServices } = useServiceStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("create");
  const [target, setTarget] = useState<Package | null>(null);

  useEffect(() => {
    fetchPackages();
    fetchServices(); // needed for the multiselect inside ManagementModal
  }, [fetchPackages, fetchServices]);

  const openCreate = () => {
    setTarget(null);
    setMode("create");
    setModalOpen(true);
  };
  const openEdit = (p: Package) => {
    setTarget(p);
    setMode("edit");
    setModalOpen(true);
  };
  const openDelete = (p: Package) => {
    setTarget(p);
    setMode("delete");
    setModalOpen(true);
  };

  // For edit pre-fill: convert services array → serviceIds array
  const toInitial = (pkg: Package) => ({
    ...pkg,
    serviceIds: pkg.services.map((s) => s.serviceId),
  });

  const handleCreate = async (data: any) => {
    const result = await addPackage(data);
    if (result.success) addToast(t("packages.addPackage") + " ✓", "success");
    return result;
  };
  const handleEdit = async (data: any) => {
    const result = await editPackage(target!.id, data);
    if (result.success) addToast(t("common.save") + " ✓", "success");
    return result;
  };
  const handleDelete = async () => {
    const result = await removePackage(target!.id);
    if (result.success) addToast("Package deleted", "success");
    return result;
  };

  if (loading) return <Loading message={t("packages.title") + "…"} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-base-200 p-6 rounded-md border border-base-300 flex justify-between items-center shadow-lg">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic text-primary">
            {t("packages.title")}
          </h3>
          <p className="text-[10px] font-bold opacity-50 uppercase tracking-wider">
            {t("packages.subtitle")}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="btn btn-primary btn-sm rounded-none font-bold gap-2 uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20"
        >
          <Plus size={16} /> {t("packages.addPackage")}
        </button>
      </div>

      {/* Empty state */}
      {packages.length === 0 && (
        <div className="flex items-center justify-center py-16 opacity-20">
          <p className="font-black uppercase tracking-widest text-sm">
            {t("packages.noPackages")}
          </p>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-base-200 border border-base-300 rounded-md overflow-hidden hover:border-primary/50 transition-all group shadow-sm"
          >
            {/* Card header */}
            <div className="p-5 border-b border-base-300 flex justify-between items-start bg-base-300/30">
              <h4 className="font-black uppercase text-sm tracking-tight">
                {pkg.name}
              </h4>
              <span className="text-primary font-black text-sm italic">
                {pkg.price.toLocaleString()} FCFA
              </span>
            </div>

            {/* Services list */}
            <div className="p-5 space-y-3">
              <p className="text-[9px] font-bold uppercase opacity-40 tracking-widest">
                {t("packages.included")} :
              </p>
              <div className="flex flex-wrap gap-2">
                {pkg.services.length > 0 ? (
                  pkg.services.map((item) => (
                    <div
                      key={item.serviceId}
                      className="flex items-center gap-1 bg-base-300 px-2 py-1 rounded-sm border border-base-100"
                    >
                      <Check size={10} className="text-primary" />
                      <span className="text-[10px] font-bold uppercase">
                        {item.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-[10px] italic opacity-30">
                    {t("packages.noServices")}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-2 bg-base-300/10 flex justify-end gap-1">
              <button
                onClick={() => openEdit(pkg)}
                className="btn btn-ghost btn-xs rounded-sm hover:text-primary transition-colors"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => openDelete(pkg)}
                className="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ManagementModal
        open={modalOpen}
        mode={mode}
        onClose={() => setModalOpen(false)}
        fields={PACKAGE_FIELDS}
        entityName="Package"
        accentColor="primary"
        initial={target ? toInitial(target) : undefined}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default PackManagement;
