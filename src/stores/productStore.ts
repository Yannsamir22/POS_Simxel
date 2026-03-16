import { create } from "zustand";
import { fetchProducts, createProduct, updateProduct, deleteProduct, adjustProductStock} from "../services/productService";

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
  fetchProducts: () => Promise<void>;
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });

    try {
      const res = await fetchProducts();
      set({
        products: res.data,
        loading: false,
      });
    } catch (error: any) {
      console.error("Failed to fetch products, ", error);
      set({ loading: false });
    }
  },
}));
