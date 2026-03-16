import { create } from "zustand";
import { fetchServices } from "../services/serviceService";

export interface Service {
  id: string;
  name: string;
  price: number;
}

type ServiceState = {
  services: Service[];
  loading: boolean;
  fetchServices: () => Promise<void>;
};

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  loading: false,

  fetchServices: async () => {
    set({ loading: true });

    try {
      const res = await fetchServices();
      set({
        services: res.data,
        loading: false,
      });
    } catch (error: any) {
      console.error("Failed to fetch services, ", error);
      set({ loading: false });
    }
  },
}));
