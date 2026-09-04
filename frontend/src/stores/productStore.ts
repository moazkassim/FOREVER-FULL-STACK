import { create } from "zustand";

import { devtools } from "zustand/middleware";
import type { ProductState } from "@/types/product.types";

export const useProductStore = create<ProductState>()(
  devtools(
    (set) => ({
      search: "",
      setSearch: (search) => set({ search }),
      showSearch: false,
      setShowSearch: (show) => set({ showSearch: show }),
    }),
    { name: "productStore" },
  ),
);
