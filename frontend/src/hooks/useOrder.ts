import {
  cashOnDeliverPlaceOrder,
  fetchAllOrders,
  stripePlaceOrder,
  verifyStripe,
} from "@/services/orderService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchAllOrders,
  });
};
export const useCashOnDeliverPlaceOrder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: cashOnDeliverPlaceOrder,
    onSuccess: () => {
      queryClient.setQueryData(["cartItems"], {
        cartProducts: {},
        cartCount: 0,
      });
      toast.success(`🎉 Order placed successfully! Order`, {
        position: "top-right",
        autoClose: 5000,
      });
      navigate("/orders");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to place order", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Order error:", error);
    },
    retry: 1,
    retryDelay: 1000,
  });
};
export const useStripePlaceOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stripePlaceOrder,
    onSuccess: () => {
      queryClient.setQueryData(["cartItems"], {
        cartProducts: {},
        cartCount: 0,
      });
      toast.success(`🎉 Order placed successfully! Order`, {
        position: "top-right",
        autoClose: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to place order", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Order error:", error);
    },
    retry: 1,
    retryDelay: 1000,
  });
};
export const useVerifyStripe = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: verifyStripe,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.setQueryData(["cartItems"], {});
        toast.success("Payment verified!");
        navigate("/orders");
      } else {
        toast.error(data.message || "Payment verification failed");
        navigate("/cart");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to place order", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Payment verification Error:", error);
    },
  });
};
