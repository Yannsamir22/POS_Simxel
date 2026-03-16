import { create } from "zustand";
import {
  adjustProductStock,
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../services/productService";

export interface Product {
  id: string;
  name: string;
  unitCost: number | null;
  salePrice: number;
  stock: number;
  minStockAlert: number;
}

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;

  fetchProducts: () => Promise<void>;
  addProduct: (data: {
    name: string;
    salePrice: number;
    unitCost?: number;
    stock?: number;
  }) => Promise<{ success: boolean; error?: string }>;
  editProduct: (
    id: string,
    data: {
      name?: string;
      salePrice?: number;
      unitCost?: number;
      stock?: number;
    },
  ) => Promise<{ success: boolean; error?: string }>;
  removeProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  adjustStock: (
    id: string,
    quantity: number,
  ) => Promise<{ success: boolean; error?: string }>;
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchProducts();
      // Backend shape: { ok: true, data: Product[] }
      set({ products: res.data ?? [], loading: false });
    } catch (error: any) {
      const msg = error.response?.data?.error ?? "Failed to fetch products";
      console.error(msg);
      set({ loading: false, error: msg });
    }
  },

  addProduct: async (data) => {
    try {
      const res = await createProduct(data);
      if (res.ok) {
        set((state) => ({ products: [...state.products, res.data] }));
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to create product",
      };
    }
  },

  editProduct: async (id, data) => {
    try {
      const res = await updateProduct(id, data);
      if (res.ok) {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...res.data } : p,
          ),
        }));
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to update product",
      };
    }
  },

  removeProduct: async (id) => {
    try {
      const res = await deleteProduct(id);
      if (res.ok) {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to delete product",
      };
    }
  },

  adjustStock: async (id, quantity) => {
    try {
      const res = await adjustProductStock(id, quantity);
      if (res.ok) {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...res.data } : p,
          ),
        }));
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error ?? "Failed to adjust stock",
      };
    }
  },
}));
