import { create } from "zustand";
import api from "../lib/axios";
import { getErrorMessage } from "../utils/getErrorMessage";
import { toast } from "react-toastify";
import { devtools } from "zustand/middleware";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  bestseller: boolean;
}
interface ProductState {
  products: Product[];
  getProductsData: () => void;
  search: string;
  showSearch: boolean;
  setSearch: (search: string) => void;
  setShowSearch: (show: boolean) => void;
}
export const useProductStore = create<ProductState>()(
  devtools(
    (set) => ({
      products: [],
      search: "",
      setSearch: (search) => set({ search }),
      showSearch: false,
      setShowSearch: (show) => set({ showSearch: show }),
      getProductsData: async () => {
        try {
          const response = await api.get("/api/product/list");

          if (response.data.success) {
            set({ products: response.data.products });
          } else {
            toast.error(response.data.message);
          }
        } catch (error: any) {
          console.log(error);
          toast.error(getErrorMessage(error));
        }
      },
    }),
    { name: "productStore" },
  ),
);
