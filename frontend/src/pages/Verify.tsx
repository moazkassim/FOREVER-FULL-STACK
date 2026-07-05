import { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

import { toast } from "react-toastify";
import api from "../lib/axios";
import { getErrorMessage } from "../utils/getErrorMessage";

const Verify = () => {
  const { navigate, token, setCartItems } = useContext(ShopContext);
  const [searchParams, _setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    if (!success || !orderId) {
      toast.error("Invalid verification link");
      setTimeout(() => {
        navigate("/cart");
      }, 3000);
      return;
    }
    try {
      if (!token) {
        return null;
      } else {
        const response = await api.post("/api/order/verifyStripe", {
          success,
          orderId,
        });

        if (response.data.success) {
          setCartItems({});
          navigate("/orders");
        } else {
          navigate("/cart");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));
    }
  };
  useEffect(() => {
    verifyPayment();
  }, [token]);
  return <div></div>;
};

export default Verify;
