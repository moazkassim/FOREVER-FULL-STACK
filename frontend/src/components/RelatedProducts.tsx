import Title from "./Title";
import ProductItem from "./ProductItem";
import { useProducts } from "@/hooks/useProducts";
import type { RelatedProductsProps } from "@/types/product.types";
const RelatedProducts = ({ category, subCategory }: RelatedProductsProps) => {
  const { data, isPending, error } = useProducts({
    category: [category],
    subCategory: [subCategory],
  });

  if (isPending) return "Loading...";
  if (!data) return;
  if (error) return "An error has occurred: " + error.message;
  return (
    <section className="my-24">
      <div className=" text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {data.products.map((item) => (
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
