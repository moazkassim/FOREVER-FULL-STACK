import Title from "./Title";
import { useCartStore } from "../stores/cartStore";

import { useShallow } from "zustand/shallow";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useProducts } from "@/hooks/useProducts";
import { getCartAmount } from "@/services/cartService";
import { useCartItems } from "@/hooks/useCart";
const CartTotal = () => {
  const { delivery_fee, currency } = useCartStore(
    useShallow((state) => ({
      delivery_fee: state.delivery_fee,
      currency: state.currency,
    })),
  );
  const { data: productData, isPending, error } = useProducts();
  const { data: cart } = useCartItems();
  let cartAmount: any;
  if (productData?.products)
    cartAmount = getCartAmount(productData.products, cart.cartProducts);
  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  return (
    <div className=" w-full">
      <div className=" text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium  items-end">Subtotal</TableCell>
            <TableCell className="font-medium flex  justify-end ">
              {currency}
              {cartAmount}.00
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Shipping Fee</TableCell>
            <TableCell className="font-medium flex  justify-end ">
              {currency}
              {delivery_fee}.00
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Total</TableCell>
            <TableCell className="font-medium flex  justify-end ">
              {currency}
              {cartAmount === 0 ? 0 : cartAmount + delivery_fee}
              .00
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CartTotal;
