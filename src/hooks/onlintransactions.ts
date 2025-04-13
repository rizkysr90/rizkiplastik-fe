import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  fetchOnlineTransactionById,
  fetchOnlineTransactionsWithPagination,
} from "./../services/onlinetransactions";
import {
  GetOnlineTransactionsResponse,
  OnlineTransaction,
  OnlineTransactionsQueryParams,
} from "./../types/services/onlineTransaction";

// Define query keys as constants for consistency
export const queryKeys = {
  onlineTransactions: ["onlineTransactions"] as const,
  onlineTransactionsList: (params?: OnlineTransactionsQueryParams) =>
    ["onlineTransactions", "list", params] as const,
  onlineTransactionsPaginated: (params?: OnlineTransactionsQueryParams) =>
    ["onlineTransactions", "paginated", params] as const,
  onlineTransaction: (id: string) => ["onlineTransaction", id] as const,
};

/**
 * Custom hook to fetch online transactions with pagination metadata
 * @param params Query parameters for pagination, filtering, etc.
 * @param token Optional authentication token
 * @returns TanStack query result for online transactions with pagination
 */
export const useOnlineTransactionsWithPagination = (
  params?: OnlineTransactionsQueryParams,
  token?: string
): UseQueryResult<GetOnlineTransactionsResponse, Error> => {
  return useQuery({
    queryKey: queryKeys.onlineTransactionsPaginated(params),
    queryFn: () => fetchOnlineTransactionsWithPagination(params, token),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Custom hook to fetch a single online transaction by ID
 * @param id - The online transaction ID
 * @param token - Optional authentication token
 * @returns TanStack query result for a single online transaction
 */
export const useOnlineTransaction = (
  id: string,
  token?: string
): UseQueryResult<OnlineTransaction, Error> => {
  return useQuery({
    queryKey: queryKeys.onlineTransaction(id),
    queryFn: () => fetchOnlineTransactionById(id, token),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id, // Only run the query if there's an ID
  });
};
