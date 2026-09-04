import type { ProductType } from "./product.types";

export interface CartDisplayItem {
  _id: string;
  size: string;
  quantity: number;
}
export type CartData = {
  [itemId: string]: {
    [size: string]: number;
  };
};
export interface CartState {
  cartItems: CartData;
  currency: string;
  delivery_fee: number;
  setCartItems: (items: CartData) => void;
  clearCart: () => void;
  addToCart: (itemId: string, size: string) => void;
  getCartCount: () => number;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  getUserCart: () => void;
  getCartAmount: (products: ProductType[]) => number;
}
