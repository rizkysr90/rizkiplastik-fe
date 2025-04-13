import {
  GetOnlineTransactionResponse,
  GetOnlineTransactionsResponse,
  OnlineTransaction,
  OnlineTransactionsQueryParams,
} from "../types/services/onlineTransaction";
import { handleResponse } from "./products";

const API_URL =
  import.meta.env.VITE_BASE_URL_RIZKIPLASTIK_BE || "http://localhost:8080";
console.log(import.meta.env.BASE_URL_RIZKIPLASTIK_BE);
/**
 * Converts query parameters object to URL query string
 * @param params Query parameters object
 * @returns URL query string
 */
const createQueryString = (params: OnlineTransactionsQueryParams): string => {
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
 * Fetches online transactions with pagination details
 * @param params Query parameters for pagination, sorting, etc.
 * @returns Promise resolving to the full response including metadata
 */
export const fetchOnlineTransactionsWithPagination = async (
  params?: OnlineTransactionsQueryParams,
  authorization?: string
): Promise<GetOnlineTransactionsResponse> => {
  try {
    const queryString = params ? createQueryString(params) : "";
    const response = await fetch(
      `${API_URL}/api/v1/online-transactions${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authorization}`,
        },
      }
    );

    return await handleResponse<GetOnlineTransactionsResponse>(response);
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch products with pagination");
  }
};

/**
 * Fetches a single online transaction by ID
 * @param id - The online transaction ID
 * @returns Promise resolving to a online transaction object
 */
export const fetchOnlineTransactionById = async (
  id: string,
  authorization?: string
): Promise<OnlineTransaction> => {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/online-transactions/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authorization}`,
        },
      }
    );

    const data = await handleResponse<GetOnlineTransactionResponse>(response);
    return data.data;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error(`Failed to fetch product with ID: ${id}`);
  }
};
