import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchSummaryData } from "../services/summaries";
import { RequestSummary, ResponseSummary } from "../types/services/summaries";
// Define query keys
export const summaryQueryKeys = {
    summary: (params: RequestSummary) => ["summary", params] as const,
};

/**
 * Custom hook to fetch summary data
 * @param params Request parameters containing start and end dates
 * @param token Optional authentication token
 * @returns TanStack query result for summary data
 */
export const useSummaryData = (
    params: RequestSummary,
    token?: string
): UseQueryResult<ResponseSummary, Error> => {
    return useQuery({
        queryKey: summaryQueryKeys.summary(params),
        queryFn: () => fetchSummaryData(params, token),
        enabled: !!(params.start_date && params.end_date), // Only run query when both dates are provided
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};