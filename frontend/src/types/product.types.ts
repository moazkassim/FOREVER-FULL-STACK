export interface ProductType {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  bestseller: boolean;
}

export interface ProductState {
  search: string;
  showSearch: boolean;
  setSearch: (search: string) => void;
  setShowSearch: (show: boolean) => void;
}

export interface RelatedProductsProps {
  category: string;
  subCategory: string;
}

export interface ProductFilters {
  category?: string[];
  subCategory?: string[];
  search?: string;
  sortType?: string;
  bestseller?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface ProductsResponse {
  products: ProductType[];
  pagination: PaginationInfo;
}

export interface ProductResponse {
  success: boolean;
  products: ProductType[];
  pagination?: PaginationInfo;
  message?: string;
}
