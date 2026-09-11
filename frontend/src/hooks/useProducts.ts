import {
  fetchBestSellerProducts,
  fetchLatestProducts,
  fetchProducts,
  fetchSingleProduct,
} from "@/services/productService";
import type { ProductFilters, ProductsResponse } from "@/types/product.types";

import { useQuery } from "@tanstack/react-query";

//
export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery<ProductsResponse>({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};
export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchSingleProduct(productId),
    enabled: !!productId,
  });
};

export const useLatestProducts = (limit: number = 10) => {
  return useQuery({
    queryKey: ["products", "latest", limit],
    queryFn: () => fetchLatestProducts(limit),
  });
};

export const useBestsellers = () => {
  return useQuery({
    queryKey: ["products", "bestsellers"],
    queryFn: fetchBestSellerProducts,
    staleTime: 1000 * 60 * 5,
  });
};
