import { useEffect, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { useCartStore } from "../stores/cartStore";

import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";
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
import { useProducts } from "@/hooks/useProducts";
import type { CartDisplayItem } from "@/types/cart.types";
import type { ProductType } from "@/types/product.types";
import { useCartItems, useUpdateCartMutation } from "@/hooks/useCart";
// TODO:fix delete a cart item

const Cart = () => {
  const navigate = useNavigate();
  const {
    data: productsData,
    isPending: isProductsLoading,
    error: productsError,
  } = useProducts();
  const {
    data: cart,
    isLoading: isCartLoading,
    error: cartError,
  } = useCartItems();
  const updateQuantity = useUpdateCartMutation();
  const [cartData, setCartData] = useState<CartDisplayItem[]>([]);
  const { currency } = useCartStore(
    useShallow((state) => ({
      // updateQuantity: state.updateQuantity,
      currency: state.currency,
      // cartItems: state.cartItems,
    })),
  );

  useEffect(() => {
    if (!productsData?.products || !cart?.cartProducts) {
      setCartData([]);
      return;
    }

    const tempData: CartDisplayItem[] = [];
    const cartProducts = cart.cartProducts;

    for (const productId in cartProducts) {
      const sizes = cartProducts[productId];
      if (!sizes) continue;

      for (const size in sizes) {
        const quantity = sizes[size];
        if (quantity > 0) {
          tempData.push({
            _id: productId,
            size: size,
            quantity: quantity,
          });
        }
      }
    }

    setCartData(tempData);
  }, [productsData, cart]);

  if (isProductsLoading || isCartLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading cart...</div>
      </div>
    );
  }
  if (productsError || cartError) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-lg text-red-500">
          {productsError?.message || cartError?.message || "An error occurred"}
        </div>
      </div>
    );
  }
  if (cartData.length === 0 || cart?.cartCount === 0)
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
    <div className="pt-14">
      <div className=" text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      <div className=" flex flex-col justify-between lg:flex-row items-center gap-10">
        <div className="flex w-full max-w-lg flex-col gap-6">
          {cartData.map((item) => {
            const productData = productsData?.products?.find(
              (product: ProductType) => product._id === item._id,
            );
            if (!productData) {
              return null;
            }

            return (
              <Item
                variant="outline"
                key={`${item._id}-${item.size}`}
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
                      <span className="text-black font-sm">
                        Price:{" "}
                        <span className="text-orange-700 font-sm">
                          {currency}
                          {productData?.price}
                        </span>
                      </span>
                      <span className="  bg-slate-50 text-black font-sm ">
                        Size:{" "}
                        <span className="text-orange-700 font-sm">
                          {item.size}
                        </span>
                      </span>
                    </ItemDescription>
                  </ItemContent>
                </div>
                <ItemActions>
                  <Input
                    type="number"
                    min={1}
                    className="border min-w-10"
                    defaultValue={item.quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || value === "0") return;

                      if (cart?.cartProducts) {
                        updateQuantity.mutate({
                          itemId: item._id,
                          size: item.size,
                          quantity: Number(value),
                          cartItems: cart.cartProducts,
                        });
                      }
                    }}
                    disabled={updateQuantity.isPending}
                  />

                  <Button
                    className=" w-4 mr-2 sm:w-5 cursor-pointer"
                    onClick={() =>
                      updateQuantity.mutate({
                        itemId: item._id,
                        size: item.size,
                        quantity: 0,
                        cartItems: cart.cartProducts,
                      })
                    }
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
           flex-col  sm:w-112.5 "
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
