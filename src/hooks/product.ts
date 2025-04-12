// src/hooks/useProducts.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  fetchProductById,
  fetchProducts,
  fetchProductsWithPagination,
} from "../services/products";
import {
  GetProductsResponse,
  Product,
  ProductsQueryParams,
} from "../types/services/products";

// Define query keys as constants for consistency
export const queryKeys = {
  products: ["products"] as const,
  productsList: (params?: ProductsQueryParams) =>
    ["products", "list", params] as const,
  productsPaginated: (params?: ProductsQueryParams) =>
    ["products", "paginated", params] as const,
  product: (id: string) => ["product", id] as const,
};

/**
 * Custom hook to fetch all products
 * @returns TanStack query result for products
 */
export const useProducts = (): UseQueryResult<Product[], Error> => {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: () => fetchProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Custom hook to fetch products with query parameters
 * @param params Query parameters for filtering, sorting, etc.
 * @returns TanStack query result for products
 */
export const useProductsList = (
  params?: ProductsQueryParams
): UseQueryResult<Product[], Error> => {
  return useQuery({
    queryKey: queryKeys.productsList(params),
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Custom hook to fetch products with pagination metadata
 * @param params Query parameters for pagination, sorting, etc.
 * @returns TanStack query result for products with pagination
 */
export const useProductsWithPagination = (
  params?: ProductsQueryParams,
  token?: string
): UseQueryResult<GetProductsResponse, Error> => {
  return useQuery({
    queryKey: queryKeys.productsPaginated(params),
    queryFn: () => fetchProductsWithPagination(params, token),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Custom hook to fetch a single product by ID
 * @param id - The product ID
 * @returns TanStack query result for a single product
 */
export const useProduct = (id: string): UseQueryResult<Product, Error> => {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => fetchProductById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id, // Only run the query if there's an ID
  });
};
