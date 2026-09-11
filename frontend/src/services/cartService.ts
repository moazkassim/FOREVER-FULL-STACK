import api from "@/lib/axios";
import type {
  AddToCartRequest,
  CartItem,
  UpdateCartRequest,
} from "@/types/cart.types";
import type { ProductType } from "@/types/product.types";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { toast } from "react-toastify";
export const getUserCart = async () => {
  try {
    const response = await api.post("/api/cart/get", {});

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch cart");
    }

    return response.data;
  } catch (error: any) {
    // ✅ Return empty cart on 401 instead of throwing
    if (error.response?.status === 401) {
      return { cartProducts: {}, cartCount: 0, success: false };
    }

    console.error("Get cart error:", error);
    throw new Error(getErrorMessage(error) || "Failed to fetch cart");
  }
};

export const getCartAmount = (
  products: ProductType[],
  cartItems: CartItem[],
) => {
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
};

export const addToCart = async ({
  itemId,
  size,
}: AddToCartRequest): Promise<CartItem> => {
  if (!size) {
    throw new Error("Please select a product size");
  }
  try {
    const response = await api.post("/api/cart/add", {
      itemId,
      size,
    });
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to add to cart");
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(getErrorMessage(error) || "Failed to add item to cart");
  }
};
export const updateQuantity = async ({
  itemId,
  size,
  quantity,
  cartItems,
}: UpdateCartRequest) => {
  if (!cartItems[itemId as any]) return;
  try {
    await api.post("/api/cart/update", { itemId, size, quantity });
  } catch (error: any) {
    console.log(error);
    throw new Error(getErrorMessage(error) || "Failed to add item to cart");
  }
};
export const getCartCount = (cartItems: CartItem[]) => {
  let totalCount = 0;
  for (const items in cartItems) {
    for (const item in cartItems[items]) {
      if (cartItems[items][item] > 0) {
        totalCount += cartItems[items][item];
      }
    }
  }
  return totalCount;
};
