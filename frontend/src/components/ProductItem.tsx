import { Link } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface ProductItem {
  id: string;
  image: string[];
  name: string;
  price: number;
  sizes: string[];
}
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { toast } from "react-toastify";
import { useAddToCartMutation } from "@/hooks/useCart";
const ProductItem = ({ id, image, name, price, sizes }: ProductItem) => {
  const { currency } = useCartStore(
    useShallow((state) => ({
      currency: state.currency,
      // addToCart: state.addToCart,
    })),
  );
  const addToCart = useAddToCartMutation();
  const [selectedSizes, setSelectedSizes] = useState<string>("");
  const items = sizes.map((item) => {
    return { label: item, value: item };
  });
  return (
    <>
      <Item className="p-0" variant="outline">
        <Link className=" text-gray-700 cursor-pointer" to={`/product/${id}`}>
          <ItemHeader>
            <div className="overflow-hidden">
              <img
                className="hover:scale-110 transition ease-in-out"
                src={image[0]}
                alt=""
              />
            </div>
          </ItemHeader>
          <ItemContent className="p-2 ">
            <ItemTitle className=" pb-1 text-sm">
              <p className="hover:underline cursor-pointer">{name}</p>
            </ItemTitle>
            <ItemDescription className=" text-sm font-medium">
              <span> {currency}</span>
              {price}
            </ItemDescription>
          </ItemContent>
        </Link>
        <Dialog>
          <DialogTrigger asChild className="w-full ">
            <Button className="w-full cursor-pointer rounded-none">
              Add to cart
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <div className=" flex flex-row justify-start gap-2 items-center ">
                <div>
                  <img src={image[0]} className=" w-20 h-20 rounded-full" />
                </div>
                <DialogTitle>{name}</DialogTitle>
              </div>
              <Separator />
              <div className="flex flex-row justify-start items-center gap-10 p-2  ">
                <span className=" flex  items-center gap-2">
                  Size:
                  <Select
                    value={selectedSizes}
                    onValueChange={setSelectedSizes}
                  >
                    <SelectTrigger className="w-full max-w-50 h-8">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {items.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </span>
                <p>
                  Price:{" " + currency}
                  {price}
                </p>
              </div>
              <DialogDescription className="p-2">
                Easy return and exchange policy within 7 days.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className=" gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  disabled={addToCart.isPending || !selectedSizes}
                  className="w-35 "
                  onClick={() => {
                    if (!selectedSizes) {
                      toast.warn("please select a size");
                    } else {
                      addToCart.mutate({
                        itemId: id,
                        size: selectedSizes,
                      });
                    }
                  }}
                >
                  {addToCart.isPending ? "Adding..." : "ADD TO CART"}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Item>
    </>
  );
};

export default ProductItem;
