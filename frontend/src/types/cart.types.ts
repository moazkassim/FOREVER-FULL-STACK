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
}
export interface AddToCartRequest {
  itemId: string;
  size: string;
}

export interface UpdateCartRequest {
  itemId: string;
  size: string;
  quantity: number;
  cartItems: ProductType[];
}
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}
