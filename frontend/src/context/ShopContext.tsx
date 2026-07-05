import { createContext, useEffect, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api, { setAccessToken } from "../lib/axios";
import { getErrorMessage } from "../utils/getErrorMessage";

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

type CartData = {
  [itemId: string]: {
    [size: string]: number;
  };
};
interface ShopContextType {
  products: Product[];
  currency: string;
  delivery_fee: number;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  showSearch: boolean;
  setShowSearch: Dispatch<SetStateAction<boolean>>;
  cartItems: CartData;
  addToCart: (itemId: string, size: string) => void;
  getCartCount: () => number;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  getCartAmount: () => number;
  navigate: (path: string) => void;
  token: string;
  setCartItems: Dispatch<SetStateAction<CartData>>;
  setToken: Dispatch<SetStateAction<string>>;
  sessionLoading: boolean;
}
export const ShopContext = createContext<ShopContextType>(
  {} as ShopContextType,
);
// Props type
interface ShopContextProviderProps {
  children: ReactNode;
}

const ShopContextProvider = (props: ShopContextProviderProps) => {
  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartData>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [token, setToken] = useState<string>("");
  const [sessionLoading, setSessionLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const addToCart = async (itemId: string, size: string): Promise<void> => {
    if (!size) {
      toast.error("Select product size");
      return;
    }
    if (token) {
      try {
        await api.post("/api/cart/add", { itemId, size });
      } catch (error: any) {
        console.log(error);
        toast.error(getErrorMessage(error));
      }
    }
    setCartItems((prev) => {
      const cartData = structuredClone(prev);
      if (cartData[itemId]) {
        cartData[itemId][size] = (cartData[itemId][size] ?? 0) + 1;
      } else {
        cartData[itemId] = { [size]: 1 };
      }
      return cartData;
    });
  };
  const getCartCount = () => {
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
  const updateQuantity = async (
    itemId: string,
    size: string,
    quantity: number,
  ): Promise<void> => {
    if (!cartItems[itemId]) return;
    let cartData = structuredClone(cartItems || {});

    cartData[itemId][size] = quantity;

    setCartItems(cartData);
    if (token) {
      try {
        await api.post("/api/cart/update", { itemId, size, quantity });
      } catch (error: any) {
        console.log(error);
        toast.error(getErrorMessage(error));
      }
    }
  };

  const getUserCart = async () => {
    try {
      const response = await api.post("/api/cart/get", {});
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(getErrorMessage(error));
    }
  };
  const getCartAmount = () => {
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
  const getProductsData = async () => {
    try {
      const response = await api.get("/api/product/list");

      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(getErrorMessage(error));
    }
  };
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await api.post(
          "/api/user/refresh",
          {},
          { withCredentials: true },
        );
        if (data.success) {
          setToken(data.token);
          setAccessToken(data.token);
          await getUserCart();
        }
      } catch {
        // Refresh token expired or doesn't exist — user needs to log in
        setToken("");
      } finally {
        setSessionLoading(false);
      }
    };
    restoreSession();
    getProductsData();
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    token,
    setCartItems,
    setToken,
    sessionLoading,
  };

  if (sessionLoading) {
    return (
      <ShopContext.Provider value={value}>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-400">Loading...</p>
        </div>
      </ShopContext.Provider>
    );
  }
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
export default ShopContextProvider;
