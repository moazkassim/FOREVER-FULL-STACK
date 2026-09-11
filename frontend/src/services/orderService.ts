import api from "@/lib/axios";

import { toast } from "react-toastify";

export const cashOnDeliverPlaceOrder = async (orderData: {}) => {
  if (!orderData) {
    throw new Error("Order data is required");
  }
  const response = await api.post("/api/order/place", orderData);
  if (response.data.success) {
  } else {
    toast.error(response.data.message);
    throw new Error(response.data.message || "Failed to place order");
  }
};
export const stripePlaceOrder = async (orderData: {}) => {
  const response = await api.post("/api/order/stripe", orderData);
  if (response.data.success) {
    const { session_url } = response.data;
    window.location.replace(session_url);
  } else {
    toast.error(response.data.message);
  }
};
export const fetchAllOrders = async () => {
  try {
    const response = await api.post("/api/order/userorders", {});
    if (response.data.success) {
      return response.data.orders.reverse();
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};
