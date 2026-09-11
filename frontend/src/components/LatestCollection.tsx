import Title from "./Title";
import ProductItem from "./ProductItem";
import { ItemGroup } from "./ui/item";
import { useLatestProducts } from "@/hooks/useProducts";
import type { ProductType } from "@/types/product.types";

const LatestCollection = () => {
  const { data: products, isPending, error } = useLatestProducts(10);
  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <section className=" my-20">
      <div className=" container">
        <div className=" text-center text-3xl my-10">
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
          {products.map((item: ProductType, index: any) => (
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
