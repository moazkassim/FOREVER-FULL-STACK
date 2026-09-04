import { useCartItems } from "@/hooks/useCart";
import api from "@/lib/axios";
import type { ProductType } from "@/types/product.types";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { toast } from "react-toastify";

export const getUserCart = async () => {
  try {
    const response = await api.post("/api/cart/get", {});
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch cart");
    }
    return response.data.cartData;
  } catch (error: any) {
    toast.error(getErrorMessage(error));
    throw error; //
  }
};

export const getCartAmount = (products: ProductType[]) => {
  const { data: cartItems } = useCartItems();

  let totalAmount = 0;
  for (const items in cartItems) {
    let itemInfo = products.find(
      (product: ProductType) => product._id === items,
    );
    if (!itemInfo) continue;
    for (const item in cartItems[items]) {
      try {
        if (cartItems[items][item] > 0 && itemInfo) {
          totalAmount += itemInfo.price * cartItems[items][item];
        }
        return totalAmount;
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    }
  }

  return totalAmount;
};
// TODO : create this service
export const addToCart = async (itemId, size) => {};
