import { create } from "zustand";
import { toast } from "react-toastify";
import api from "../lib/axios";
import { getErrorMessage } from "../utils/getErrorMessage";
import { devtools } from "zustand/middleware";

type CartData = {
  [itemId: string]: {
    [size: string]: number;
  };
};
interface Product {
  _id: string;
  price: number;
}
interface CartState {
  cartItems: CartData;
  currency: string;
  delivery_fee: number;
  setCartItems: (items: CartData) => void;
  clearCart: () => void;
  addToCart: (itemId: string, size: string) => void;
  getCartCount: () => number;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  getUserCart: () => void;
  getCartAmount: (products: Product[]) => number;
}

export const useCartStore = create<CartState>()(
  devtools(
    (set, get) => ({
      cartItems: {},
      currency: "$",
      delivery_fee: 10,
      setCartItems: (items) => {
        set({ cartItems: items });
      },
      addToCart: async (itemId, size) => {
        if (!size) {
          toast.error("Select product size");
          return;
        }

        try {
          await api.post("/api/cart/add", { itemId, size });
        } catch (error: any) {
          console.log(error);
          toast.error(getErrorMessage(error));
        }

        set((state) => {
          const cartData = structuredClone(state.cartItems);
          if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] ?? 0) + 1;
          } else {
            cartData[itemId] = { [size]: 1 };
          }

          return { cartItems: cartData };
        });
      },
      updateQuantity: async (itemId, size, quantity) => {
        const { cartItems } = get();
        if (!cartItems[itemId]) return;
        set((state) => {
          let cartData = structuredClone(state.cartItems);
          cartData[itemId][size] = quantity;
          return { cartItems: cartData };
        });

        try {
          await api.post("/api/cart/update", { itemId, size, quantity });
        } catch (error: any) {
          console.log(error);
          toast.error(getErrorMessage(error));
        }
      },
      getUserCart: async () => {
        try {
          const response = await api.post("/api/cart/get", {});
          if (response.data.success) {
            set({ cartItems: response.data.cartData });
          }
        } catch (error: any) {
          console.log(error);
          toast.error(getErrorMessage(error));
        }
      },
      getCartAmount: (products) => {
        const { cartItems } = get();
        let totalAmount = 0;
        for (const items in cartItems) {
          let itemInfo = products.find((product) => product._id === items);
          if (!itemInfo) continue;
          for (const item in cartItems[items]) {
            try {
              if (cartItems[items][item] > 0 && itemInfo) {
                totalAmount += itemInfo.price * cartItems[items][item];
              }
            } catch (error: any) {
              console.log(error);
              toast.error(error.message);
            }
          }
        }

        return totalAmount;
      },
      getCartCount: () => {
        const { cartItems } = get();
        let totalCount = 0;
        for (const items in cartItems) {
          for (const item in cartItems[items]) {
            if (cartItems[items][item] > 0) {
              totalCount += cartItems[items][item];
            }
          }
        }
        return totalCount;
      },
      clearCart: () => {
        set({ cartItems: {} });
      },
    }),
    { name: "cartStore" },
  ),
);
