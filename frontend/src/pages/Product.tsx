import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { useCartStore } from "../stores/cartStore";
import { useShallow } from "zustand/shallow";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BanknoteCheck, CirclePercent, Repeat } from "lucide-react";
import { useProduct } from "@/hooks/useProducts";
import { toast } from "react-toastify";
import { useAddToCartMutation } from "@/hooks/useCart";

const Product = () => {
  const { productId } = useParams<{ productId: string }>();
  const {
    data: productData,
    isPending,
    error,
  } = useProduct(productId as string);
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  useEffect(() => {
    if (productData?.image?.length) {
      setImage(productData.image[0]);
    }
  }, [productData]);

  const { currency } = useCartStore(
    useShallow((state) => ({
      currency: state.currency,
  
    })),
  );
  const addToCart = useAddToCartMutation();
  const handleAddToCart = () => {
    if (!size) {
      toast.warning("Please select a size first");
      return;
    }
    addToCart.mutate({
      itemId: productData._id,
      size: size,
    });
  };

  if (isPending) {
    return (
      <div className="border-t-2 pt-10">
        <div className="flex gap-12 flex-col sm:flex-row">
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex sm:flex-col gap-2 sm:w-[18.7%]">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-[24%] sm:w-full aspect-square" />
              ))}
            </div>
            <Skeleton className="w-full sm:w-[80%] aspect-square" />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-1/5" />
            <Skeleton className="h-20 w-4/5" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-14" />
              ))}
            </div>
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (error) return "An error has occurred: " + error.message;
  return productData ? (
    <div className="  pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* product data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* product image */}
        <div className=" flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className=" flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item: any, index: any) => (
              <img
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer"
                onClick={() => setImage(item)}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            {image && (
              <img
                src={image}
                className="w-full h-auto"
                alt={productData.name}
              />
            )}
          </div>
        </div>
        {/* Product info */}
        <div className=" flex-1">
          <h2 className=" font-medium text-2xl">{productData.name}</h2>
          <div className=" flex items-center gap-1 mt-2">
            <img src={assets.star_icon} className=" w-3" />
            <img src={assets.star_icon} className=" w-3" />
            <img src={assets.star_icon} className=" w-3" />
            <img src={assets.star_icon} className=" w-3" />
            <img src={assets.star_dull_icon} className=" w-3" />
            <p className=" pl-2">(122)</p>
          </div>
          <p className=" mt-5 text-3 font-medium">
            {currency}
            {productData.price}
          </p>
          <p className=" mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          <div className=" flex flex-col gap-4 my-8">
            <p> Select Size</p>

            <div className=" flex gap-2">
              {productData.sizes.map((item: any, index: any) => (
                <Button
                  variant={item === size ? "default" : "outline"}
                  key={index}
                  className="min-w-10 w-12 h-9"
                  onClick={() => setSize(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            className=" bg-black text-white w-35 h-12 px-8 py-3 text-sm active:bg-gray-700 cursor-pointer"
            onClick={handleAddToCart}
            disabled={addToCart.isPending || !size}
          >
            {addToCart.isPending ? "Adding..." : "ADD TO CART"}
          </Button>
          {addToCart.isError && (
            <p className="text-red-500 text-sm mt-2">
              {addToCart.error?.message}
            </p>
          )}
          <Separator className=" mt-8 sm:w-4/5" />

          <div className="text-sm  mt-5 flex flex-col gap-2 sm:w-4/5">
            <Item variant="muted" size="sm">
              <ItemMedia>
                <CirclePercent size="22" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>100% Original product.</ItemTitle>
              </ItemContent>
            </Item>
            <Item variant="muted" size="sm">
              <ItemMedia>
                <BanknoteCheck size="22" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  Cash on delivery is available in this product.
                </ItemTitle>
              </ItemContent>
            </Item>
            <Item variant="muted" size="sm">
              <ItemMedia>
                <Repeat size="22" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  Easy return and exchange policy within 7 days.
                </ItemTitle>
              </ItemContent>
            </Item>
          </div>
        </div>
      </div>
      {/* {Description & review section } */}
      <Tabs defaultValue="description" className=" mt-20">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews (122)</TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>
                An e-commerce website is an online platform that facilitates the
                buying and selling of products or services over the internet. It
                serves as a virtual marketplace where businesses and individuals
                can showcase their products, interact with customers, and
                conduct transactions without the need for a physical presence.
                E-commerce websites have gained immense popularity due to their
                convenience, accessibility, and the global reach they offer.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>
                E-commerce websites typically display products or services along
                with detailed descriptions, images, prices, and any available
                variations (e.g., sizes, colors). Each product usually has its
                own dedicated page with relevant information.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>

      {/* display relate products */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="border-t-2 pt-10 flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <p className="text-gray-500 text-lg">Product not found.</p>
      <Button variant="outline" onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </div>
  );
};

export default Product;
