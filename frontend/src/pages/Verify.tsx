import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useVerifyStripe } from "@/hooks/useOrder";
const Verify = () => {
  const [searchParams, _setSearchParams] = useSearchParams();
  const verifyStripe = useVerifyStripe();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();
  const verifyPayment = async () => {
    if (!success || !orderId) {
      toast.error("Invalid verification link");
      setTimeout(() => {
        navigate("/cart");
      }, 3000);
      return;
    }
    verifyStripe.mutate({ success, orderId });
  };
  useEffect(() => {
    verifyPayment();
  }, []);
  return <div></div>;
};
export default Verify;
