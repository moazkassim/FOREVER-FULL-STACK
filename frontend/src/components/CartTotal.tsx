import Title from "./Title";
import { useCartStore } from "../stores/cartStore";
import { useProductStore } from "../stores/productStore";
import { useShallow } from "zustand/shallow";

const CartTotal = () => {
  const { delivery_fee, currency, getCartAmount } = useCartStore(
    useShallow((state) => ({
      delivery_fee: state.delivery_fee,
      currency: state.currency,
      getCartAmount: state.getCartAmount,
    })),
  );
  const { products } = useProductStore();
  return (
    <div className=" w-full">
      <div className=" text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className=" flex flex-col gap-2 mt-2 text-sm">
        <div className=" flex justify-between ">
          <p>Subtotal</p>
          <p>
            {currency}
            {getCartAmount(products)}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between ">
          <p>Shipping Fee</p>
          <p>
            {currency}
            {delivery_fee}.00
          </p>
        </div>
        <hr />
        <div className=" flex justify-between">
          <p>Total</p>
          <p>
            {currency}
            {getCartAmount(products) === 0
              ? 0
              : getCartAmount(products) + delivery_fee}
            .00
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
