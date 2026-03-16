import {create} from "zustand"
import {getPackages} from "../services/packageService";

export interface Packages{
      id: string;
      name: string;
      price: number;
      services: string[];
}

type PackageState = {
      packages: Packages[];
      loading: boolean;
      fetchPackages: () => Promise<void>;

}

export const usePackageStore = create<PackageState>((set) => ({
      packages: [],
      loading: false,

      fetchPackages: async () => {
            set({loading: true});

            try{
                  const res = await getPackages();
                  console.log(res.data);
                  set({
                        packages: res.data,
                        loading: false,
                  });
            } catch(error: any) {
                  console.error("Failed to fetch packages, ", error);
                  set({loading: false})
            }
      }
}))