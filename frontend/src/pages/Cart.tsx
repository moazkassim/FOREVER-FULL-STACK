import { useEffect, useState } from "react";

import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { useCartStore } from "../stores/cartStore";
import { useProductStore } from "../stores/productStore";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";
import { Skeleton } from "@/components/ui/skeleton";

import { Frown, Shirt, Trash2 } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
interface CartDisplayItem {
  _id: string;
  size: string;
  quantity: number;
}

const Cart = () => {
  const { cartItems, updateQuantity, currency } = useCartStore(
    useShallow((state) => ({
      cartItems: state.cartItems,
      updateQuantity: state.updateQuantity,
      currency: state.currency,
    })),
  );
  const { products } = useProductStore();
  const [cartData, setCartData] = useState<CartDisplayItem[]>([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (products.length > 0) {
      let tempData: CartDisplayItem[] = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);
  if (cartData.length == 0)
    return (
      <Empty className="h-full bg-muted/30">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Frown />
          </EmptyMedia>
          <EmptyTitle>No Items In The Cart</EmptyTitle>
          <EmptyDescription className="max-w-xs text-pretty">
            Your cart is waiting to be filled with amazing products. Take a look
            around and treat yourself to something special.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline">
            <Shirt data-icon="inline-start" />
            Refresh
          </Button>
        </EmptyContent>
      </Empty>
    );

  return (
    <div className=" border-t pt-14">
      <div className=" text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      <div className=" flex flex-col justify-between lg:flex-row items-center gap-10">
        <div className="flex w-full max-w-lg flex-col gap-6">
          {cartData.map((item, index) => {
            const productData = products.find(
              (product) => product._id === item._id,
            );

            return (
              <Item
                variant="outline"
                key={index}
                className="   grid grid-cols-[4fr_1fr] sm:grid-cols-[4fr_1.5fr] items-center gap-4"
              >
                <div className=" flex items-start gap-6 ">
                  <ItemMedia>
                    <img
                      className=" w-10 sm:w-15"
                      src={productData?.image[0]}
                      alt=""
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle> {productData?.name}</ItemTitle>
                    <ItemDescription className="flex items-center gap-15 mt-2">
                      <p className="text-black font-sm">
                        Price:{" "}
                        <span className="text-orange-700 font-sm">
                          {currency}
                          {productData?.price}
                        </span>
                      </p>
                      <p className="  bg-slate-50 text-black font-sm ">
                        Size:{" "}
                        <span className="text-orange-700 font-sm">
                          {item.size}
                        </span>
                      </p>
                    </ItemDescription>
                  </ItemContent>
                </div>
                <ItemActions>
                  <Input
                    type="number"
                    min={1}
                    className=" border min-w-10 "
                    defaultValue={item.quantity}
                    onChange={(e) => {
                      e.target.value === "" || e.target.value === "0"
                        ? null
                        : updateQuantity(
                            item._id,
                            item.size,
                            Number(e.target.value),
                          );
                    }}
                  />
                  <Button
                    className=" w-4 mr-2 sm:w-5 cursor-pointer"
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    variant="outline"
                  >
                    <Trash2 />
                  </Button>
                </ItemActions>
              </Item>
            );
          })}
        </div>
        <div className=" flex justify-end ">
          <div
            className=" w-full flex items-center
           flex-col  sm:w-[450px] "
          >
            <CartTotal />
            <Button
              variant="outline"
              onClick={() => navigate("/place-order")}
              className=" bg-black text-white text-sm my-8 px-8 py-3 cursor-pointer"
            >
              PROCEED TO CHECKOUT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
