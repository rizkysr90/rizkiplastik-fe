// Pagination metadata matching Go's PaginationResponse
export interface PaginationResponseV2 {
  page_size: number;
  page_number: number;
  total_count: number;
  total_pages: number;
}
