import { useEffect, useState } from "react";

import Title from "./Title";
import ProductItem from "./ProductItem";
import { useProducts } from "@/hooks/useProducts";
import type { ProductType, RelatedProductsProps } from "@/types/product.types";

const RelatedProducts = ({ category, subCategory }: RelatedProductsProps) => {
  const { data: products, isPending, error } = useProducts();

  const [related, setRelated] = useState<ProductType[]>([]);

  useEffect(() => {
    if (!products) return;

    let productsCopy = products.slice();
    productsCopy = productsCopy
      .filter((item: ProductType) => category === item.category)
      .filter((item: ProductType) => subCategory === item.subCategory);
    setRelated(productsCopy.slice(0, 5));
  }, [products, category, subCategory]);
  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  return (
    <section className="my-24">
      <div className=" text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
            price={item.price}
            name={item.name}
            sizes={item.sizes}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
