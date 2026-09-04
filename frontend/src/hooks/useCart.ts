import {  getUserCart } from "@/services/cartService";

import { useQuery } from "@tanstack/react-query";

export const useCartItems = () => {
  return useQuery({
    queryKey: ["cartItems"],
    queryFn: getUserCart,
  });
};
