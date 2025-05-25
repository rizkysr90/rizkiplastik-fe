import { RequestSummary, ResponseSummary } from "../types/services/summaries";
import { handleResponse } from "./products";
const API_URL =
    import.meta.env.VITE_BASE_URL_RIZKIPLASTIK_BE || "http://localhost:8080";

/**
 * Converts summary request parameters to a query string
 * @param params Request parameters containing start and end dates
 * @returns URL query string
 */
const createSummaryQueryString = (params: RequestSummary): string => {
    const searchParams = new URLSearchParams();

    if (params.start_date) {
        searchParams.append('start_date', params.start_date);
    }

    if (params.end_date) {
        searchParams.append('end_date', params.end_date);
    }

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
};

/**
 * Fetches summary data for a date range
 * @param params Request parameters containing start and end dates
 * @param authorization Optional auth token
 * @returns Promise resolving to the summary data
 */
export const fetchSummaryData = async (
    params: RequestSummary,
    authorization?: string
): Promise<ResponseSummary> => {
    try {
        const queryString = createSummaryQueryString(params);
        const response = await fetch(`${API_URL}/api/v1/summaries${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: authorization ? `Bearer ${authorization}` : "",
            }
        });

        return await handleResponse<ResponseSummary>(response);
    } catch (error) {
        throw error instanceof Error
            ? error
            : new Error("Failed to fetch summary data");
    }
};