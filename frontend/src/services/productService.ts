import api from "@/lib/axios";
import type {
  PaginationInfo,
  ProductFilters,
  ProductResponse,
  ProductType,
} from "@/types/product.types";

// TESTING :

export const fetchProducts = async (
  filters: ProductFilters = {},
): Promise<{ products: ProductType[]; pagination: PaginationInfo }> => {
  const params = new URLSearchParams();

  if (filters.category?.length) {
    filters.category.forEach((cat) => params.append("category", cat));
  }

  if (filters.subCategory?.length) {
    filters.subCategory.forEach((sub) => params.append("subCategory", sub));
  }

  if (filters.search) {
    params.append("search", filters.search);
  }

  if (filters.sortType && filters.sortType !== "relevant") {
    params.append("sortType", filters.sortType);
  }

  if (filters.bestseller !== undefined) {
    params.append("bestseller", filters.bestseller.toString());
  }

  if (filters.page) {
    params.append("page", filters.page.toString());
  }

  if (filters.limit) {
    params.append("limit", filters.limit.toString());
  }

  const queryString = params.toString();
  const url = queryString
    ? `/api/product/list?${queryString}`
    : "/api/product/list";

  const response = await api.get<ProductResponse>(url);

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch products");
  }

  return {
    products: response.data.products,
    pagination: response.data.pagination || {
      currentPage: filters.page || 1,
      totalPages: 1,
      totalProducts: response.data.products.length,
      hasNextPage: false,
      hasPrevPage: false,
      limit: filters.limit || response.data.products.length,
    },
  };
};

// Bestsellers helper
export const fetchBestSellerProducts = async (): Promise<ProductType[]> => {
  const result = await fetchProducts({ bestseller: true });
  return result.products;
};
export const fetchSingleProduct = async (productId: string) => {
  const response = await api.get(`/api/product/${productId}`);

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch product");
  }

  return response.data.product;
};

export const fetchLatestProducts = async (limit: any) => {
  try {
    const response = await api.get("/api/product/list");
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch products");
    }
    return response.data.products.slice(0, limit);
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
