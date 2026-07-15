import { useEffect, useState } from "react";

import Title from "./Title";
import ProductItem from "./ProductItem";
import { useProductStore } from "../stores/productStore";
import { ItemGroup } from "./ui/item";
interface Product {
  _id: string;
  name: string;
  price: number;
  image: string[];
  bestseller: boolean;
  sizes: string[];
}
const LatestCollection = () => {
  const { products } = useProductStore();
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <section className=" my-10">
      <div className=" container">
        <div className=" text-center py-8 text-3xl">
          <Title text1={"LATEST"} text2={"COLLECTIONS"} />
          <p className=" w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-700">
            Discover our newest arrivals crafted with premium materials and
            modern designs.
            <br /> From everyday essentials to statement pieces, find your
            perfect look.
          </p>
        </div>
        {/* Rendering products */}
        <ItemGroup className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {latestProducts.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              sizes={item.sizes}
            />
          ))}
        </ItemGroup>
      </div>
    </section>
  );
};

export default LatestCollection;
