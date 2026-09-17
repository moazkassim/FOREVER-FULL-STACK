
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
import { useOrders } from "@/hooks/useOrder";
import { useCartStore } from "@/stores/cartStore";
import Title from "@/components/Title";
const Orders = () => {
  const { currency } = useCartStore();
  const { data: orders, isPending, error } = useOrders();
  const navigate = useNavigate();
  if (!orders || !Array.isArray(orders)) {
    return;
  }
  if (isPending) {
    return (
      <div className="border-t pt-16">
        <div className="text-2xl">
          <Title text1={"MY"} text2={"ORDERS"} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full mt-10">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-87.5" />
                  <Skeleton className="h-4 w-62.5" />
                  <Skeleton className="h-4 w-62.5" />
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="border-t pt-16">
        <div className="text-2xl">
          <Title text1={"MY"} text2={"ORDERS"} />
        </div>
        <div className="text-center py-20 text-red-500">
          Error: {error.message}
        </div>
      </div>
    );
  }
  if (orders.length === 0) {
    return (
      <Empty className="h-full bg-muted/30 mt-10">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Frown />
          </EmptyMedia>
          <EmptyTitle>No Orders Exists</EmptyTitle>
          <EmptyDescription className="max-w-xs text-pretty">
            You haven't placed any orders yet. Start shopping and discover
            products you'll love!
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
  }
  return (
    <div className=" border-t pt-16">
      <div className=" text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full   ">
        {orders.map((item, index) => (
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
              <Button className=" border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer">
                Track Order
              </Button>
            </ItemActions>
          </Item>
        ))}
      </div>
    </div>
  );
};

export default Orders;
