// src/hooks/useProducts.ts
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { useState } from "react";
import {
  deleteProduct,
  fetchProductById,
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
/**
 * Interface for the useDeleteProduct hook options
 */
interface UseDeleteProductProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  token?: string;
}
/**
 * Custom hook to handle product deletion with confirmation modal
 * @param options - Optional callbacks and token
 * @returns Object containing state and functions to handle product deletion
 */

export const useDeleteProduct = ({
  onSuccess,
  onError,
  token,
}: UseDeleteProductProps = {}) => {
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      return deleteProduct(productId, token);
    },
    onSuccess: () => {
      // Invalidate and refetch products queries to update the UI
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "products" && query.queryKey[1] === "paginated",
      });

      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  const openDeleteModal = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete);
    }
  };

  return {
    isDeleteModalOpen,
    productToDelete,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    isDeleting: deleteProductMutation.isPending,
    deleteError: deleteProductMutation.error,
  };
};
