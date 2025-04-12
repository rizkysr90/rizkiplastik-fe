// src/services/productService.ts
import {
  GetProductResponse,
  GetProductsResponse,
  Product,
  ProductsQueryParams,
} from "../types/services/products";

const API_URL =
  import.meta.env.VITE_BASE_URL_RIZKIPLASTIK_BE || "http://localhost:8080";
console.log(import.meta.env.BASE_URL_RIZKIPLASTIK_BE);

/**
 * Generic function to handle API errors
 * @param response Fetch response object
 * @returns Response if ok, throws error if not
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

/**
 * Converts query parameters object to URL query string
 * @param params Query parameters object
 * @returns URL query string
 */
const createQueryString = (params: ProductsQueryParams): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

/**
 * Fetches all products from the API
 * @param params Optional query parameters for pagination, sorting, etc.
 * @returns Promise resolving to an array of products
 */
export const fetchProducts = async (
  params?: ProductsQueryParams
): Promise<Product[]> => {
  try {
    const queryString = params ? createQueryString(params) : "";
    const response = await fetch(`${API_URL}/api/v1/products${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await handleResponse<GetProductsResponse>(response);
    return data.data;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch products");
  }
};

/**
 * Fetches a single product by ID
 * @param id - The product ID
 * @returns Promise resolving to a product object
 */
export const fetchProductById = async (
  id: string,
  authorization?: string
): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authorization}`,
      },
    });

    const data = await handleResponse<GetProductResponse>(response);
    return data.data;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error(`Failed to fetch product with ID: ${id}`);
  }
};

/**
 * Fetches products with pagination details
 * @param params Query parameters for pagination, sorting, etc.
 * @returns Promise resolving to the full response including metadata
 */
export const fetchProductsWithPagination = async (
  params?: ProductsQueryParams,
  authorization?: string
): Promise<GetProductsResponse> => {
  try {
    const queryString = params ? createQueryString(params) : "";
    const response = await fetch(`${API_URL}/api/v1/products${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authorization}`,
      },
    });

    return await handleResponse<GetProductsResponse>(response);
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch products with pagination");
  }
};

/**
 * Delete a product by ID
 * @param id - The ID of the product to delete
 * @param token - Optional authentication token
 * @returns A promise that resolves when the product is deleted
 */
export const deleteProduct = async (
  id: string,
  token?: string
): Promise<void> => {
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "An unknown error occurred",
    }));
    throw new Error(
      errorData.message || `Failed to delete product: ${response.statusText}`
    );
  }

  return;
};
