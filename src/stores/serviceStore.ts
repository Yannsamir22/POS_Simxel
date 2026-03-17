import { create } from "zustand";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
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
    data: { name?: string; price?: number }
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
      // Backend shape: { ok: true, data: Service[] }
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
      const item = res.data ?? res.service ?? res;
      set((state) => ({ services: [...state.services, item] }));
      return { success: true };
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
      const item = res.data ?? res.service ?? res;
      set((state) => ({
        services: state.services.map((s) => s.id === id ? { ...s, ...item } : s),
      }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to update service",
      };
    }
  },

  removeService: async (id) => {
    try {
      await deleteService(id);
      set((state) => ({ services: state.services.filter((s) => s.id !== id) }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to delete service",
      };
    }
  },
}));