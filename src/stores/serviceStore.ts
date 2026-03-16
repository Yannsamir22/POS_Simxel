import { create } from "zustand";
import {
  createService,
  deleteService,
  fetchServices,
  updateService,
} from "../services/serviceService";

export interface Service {
  id: string;
  name: string;
  price: number;
}

type ServiceState = {
  services: Service[];
  loading: boolean;
  error: string | null;

  fetchServices: () => Promise<void>;
  addService: (data: {
    name: string;
    price: number;
  }) => Promise<{ success: boolean; error?: string }>;
  editService: (
    id: string,
    data: { name?: string; price?: number },
  ) => Promise<{ success: boolean; error?: string }>;
  removeService: (id: string) => Promise<{ success: boolean; error?: string }>;
};

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  loading: false,
  error: null,

  fetchServices: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchServices();
      set({ services: res.data ?? [], loading: false });
    } catch (error: any) {
      const msg = error.response?.data?.error ?? "Failed to fetch services";
      console.error(msg);
      set({ loading: false, error: msg });
    }
  },

  addService: async (data) => {
    try {
      const res = await createService(data);
      if (res.ok) {
        set((state) => ({ services: [...state.services, res.data] }));
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to create service",
      };
    }
  },

  editService: async (id, data) => {
    try {
      const res = await updateService(id, data);
      if (res.ok) {
        set((state) => ({
          services: state.services.map((s) =>
            s.id === id ? { ...s, ...res.data } : s,
          ),
        }));
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to update service",
      };
    }
  },

  removeService: async (id) => {
    try {
      const res = await deleteService(id);
      if (res.ok) {
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        }));
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to delete service",
      };
    }
  },
}));
