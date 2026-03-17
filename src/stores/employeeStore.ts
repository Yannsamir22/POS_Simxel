import { create } from "zustand";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "../services/employeeService";

export interface Employee {
  id: string;
  name: string;
  role: string;
  dateOfBirth?: string | null;
  commissionRate: number;
}

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;

  loadEmployees: () => Promise<void>;
  addEmployee: (data: {
    name: string;
    role?: string;
    dateOfBirth?: string;
    commissionRate?: number;
  }) => Promise<{ success: boolean; error?: string }>;
  editEmployee: (
    id: string,
    data: {
      name?: string;
      role?: string;
      dateOfBirth?: string;
      commissionRate?: number;
    },
  ) => Promise<{ success: boolean; error?: string }>;
  removeEmployee: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  loading: false,
  error: null,

  loadEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getEmployees();
      // Backend shape: { ok: true, users: Employee[] }
      set({ employees: res.users ?? [], loading: false });
    } catch (error: any) {
      const msg = error.response?.data?.error ?? "Failed to fetch employees";
      console.error(msg);
      set({ loading: false, error: msg });
    }
  },

  addEmployee: async (data) => {
    try {
      const res = await createEmployee(data);
      const item = res.user ?? res.data ?? res;
      set((state) => ({ employees: [...state.employees, item] }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to create employee",
      };
    }
  },

  editEmployee: async (id, data) => {
    try {
      const res = await updateEmployee(id, data);
      const item = res.user ?? res.data ?? res;
      set((state) => ({
        employees: state.employees.map((e) =>
          e.id === id ? { ...e, ...item } : e,
        ),
      }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to update employee",
      };
    }
  },

  removeEmployee: async (id) => {
    try {
      await deleteEmployee(id);
      set((state) => ({
        employees: state.employees.filter((e) => e.id !== id),
      }));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to delete employee",
      };
    }
  },
}));
