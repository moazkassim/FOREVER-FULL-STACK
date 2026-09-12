import { addToCart, getUserCart, updateQuantity } from "@/services/cartService";
import { useAuthStore } from "@/stores/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCartItems = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["cartItems"],
    queryFn: getUserCart,

    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      toast.success("Item added to cart! 🛒", {
        position: "bottom-right",
        autoClose: 3000,
      });
    },
    onError: (error: Error) => {
      console.error("Add to cart error:", error);
      toast.error(error.message || "Failed to add to cart", {
        position: "bottom-right",
        autoClose: 4000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
  });
};
export const useUpdateCartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      toast.success("Cart Updated Successfully", {
        position: "bottom-right",
        autoClose: 2000,
      });
    },
    onError: (error: Error) => {
      console.error("update cart error:", error);
      toast.error(error.message || "Failed to add to cart", {
        position: "bottom-right",
        autoClose: 2000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
  });
};
