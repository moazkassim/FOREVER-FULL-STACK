import Title from "./Title";
import { useCartStore } from "../stores/cartStore";
import { useProductStore } from "../stores/productStore";
import { useShallow } from "zustand/shallow";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const CartTotal = () => {
  const { delivery_fee, currency, cartItems, getCartAmount } = useCartStore(
    useShallow((state) => ({
      delivery_fee: state.delivery_fee,
      currency: state.currency,
      getCartAmount: state.getCartAmount,
      cartItems: state.cartItems,
    })),
  );
  const { products } = useProductStore();
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
              {getCartAmount(products)}.00
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
              {getCartAmount(products) === 0
                ? 0
                : getCartAmount(products) + delivery_fee}
              .00
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CartTotal;
