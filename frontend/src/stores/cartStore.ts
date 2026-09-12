import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CartState } from "@/types/cart.types";
export const useCartStore = create<CartState>()(
  devtools(
    (set) => ({
      cartItems: {},
      currency: "$",
      delivery_fee: 10,
   
      clearCart: () => {
        set({ cartItems: {} });
      },
    }),
    { name: "cartStore" },
  ),
);
