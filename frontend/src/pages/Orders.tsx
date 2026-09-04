import Title from "../components/Title";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import api from "../lib/axios";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

import { Frown, Shirt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { OrderItem } from "@/types/product.types";

const Orders = () => {
  const { currency } = useCartStore();
  const { token } = useAuthStore();
  const [orderData, setOrderData] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const loadOrderData = async () => {
    setIsLoading(true);
    try {
      if (!token) {
        return null;
      }
      const response = await api.post("/api/order/userorders", {});
      let allOrdersItem: OrderItem[] = [];
      response.data.orders.map((order: any) => {
        order.items.map((item: any) => {
          item["status"] = order.status;
          item["payment"] = order.payment;
          item["paymentMethod"] = order.paymentMethod;
          item["date"] = order.date;
          allOrdersItem.push(item);
        });
      });

      setOrderData(allOrdersItem.reverse());

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));
    }
  };
  useEffect(() => {
    loadOrderData();
  }, [token]);

  if (orderData.length == 0)
    return (
      <Empty className="h-full bg-muted/30 mt-10">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Frown />
          </EmptyMedia>
          <EmptyTitle>No Orders Exists</EmptyTitle>
          <EmptyDescription className="max-w-xs text-pretty">
            You haven't placed any orders yet. Start shopping and discover
            products you'll love!.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => navigate("/collection")} variant="outline">
            <Shirt data-icon="inline-start" />
            Browse Products
          </Button>
        </EmptyContent>
      </Empty>
    );

  return (
    <div className=" border-t pt-16">
      <div className=" text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full mt-10">
          {Array(4)
            .fill(null)
            .map(() => (
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-87.5" />
                  <Skeleton className="h-4 w-62.5" />
                  <Skeleton className="h-4 w-62.5" />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full   ">
          {orderData.map((item, index) => (
            <Item className="w-full" variant="outline" key={index}>
              <ItemMedia>
                <Avatar className="size-15">
                  <AvatarImage src={item.image[0]} />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent className="">
                <ItemTitle>{item.name}</ItemTitle>
                <ItemDescription className=" flex items-center gap-4 mt-2 ">
                  {currency}
                  {item.price}
                  Quantity: {item.quantity}
                  Size: {item.size}
                </ItemDescription>
                <ItemDescription className="mt-2 ">
                  Date:
                  <span className="text-gray-400">
                    {item.date
                      ? new Date(item.date).toLocaleDateString()
                      : "No Date Available"}
                  </span>
                </ItemDescription>
                <ItemDescription>
                  Payment:
                  <span className=" text-gray-400">{item.paymentMethod}</span>
                </ItemDescription>
                <ItemDescription className=" flex items-center gap-2">
                  <span className=" min-w-2 h-2 rounded-full bg-green-500"></span>
                  {item.status}
                </ItemDescription>
              </ItemContent>

              <ItemActions>
                <Button
                  onClick={loadOrderData}
                  className=" border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer"
                >
                  Track Order
                </Button>
              </ItemActions>
            </Item>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
