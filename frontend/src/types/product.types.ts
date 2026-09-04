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
export interface OrderItem extends ProductType {
  size: string;
  quantity: number;
  status: string;
  payment: boolean;
  paymentMethod: string;
  date: string;
}
export interface RelatedProductsProps {
  category: string;
  subCategory: string;
}

//still unused

export interface ProductFilters {
  category?: string[];
  subCategory?: string[];
  search?: string;
  sortType?: string;
  bestseller?: boolean; // ✅ Add this
}

export interface ProductResponse {
  success: boolean;
  products: ProductType[];
  message?: string;
}
//still unused
export interface PaginatedProductsResponse {
  success: boolean;
  products: ProductType[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  message?: string;
}
