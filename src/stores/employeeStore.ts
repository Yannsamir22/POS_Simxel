import { create } from "zustand";
import { getEmployees } from "../services/employeeService";

export interface Employee {
  id: string;
  name: string;
  dateOfBirth?: string;
  commissionRate?: number; 
}

interface EmployeeState {
  employees: Employee[];
  loading: boolean;

  loadEmployees: () => Promise<void>;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  loading: false,

  loadEmployees: async () => {
    set({ loading: true });

    try {
      const res = await getEmployees();
      set({
        employees: res.users,
        loading: false,
      });
    } catch (error: any) {
      console.error("Failed to fetch employees, ", error);
      set({ loading: false });
    }
  },
}));
