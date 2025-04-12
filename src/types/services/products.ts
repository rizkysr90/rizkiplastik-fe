// Pagination metadata matching Go's PaginationResponse
export interface PaginationResponse {
  page_size: number;
  page_number: number;
}

// Get products response matching Go's GetProductsResponse
export interface GetProductsResponse {
  metadata: PaginationResponse;
  data: Product[];
}

// Get product by ID response matching Go's GetProductResponse
export interface GetProductResponse {
  data: Product;
}

// Optional query parameters for fetching products
export interface ProductsQueryParams {
  page_number?: number;
  page_size?: number;
  sort?: string;
  filter?: string;
  // Add any other query parameters your API supports
}
// Base Product type
export interface Product {
  id: string;
  name: string;
  cost_price: number;
  shopee_sale_price: number;
  shopee_category: string;
  gross_profit_percentage: number;
  // Add any other fields your Product struct has in Go
}

// Types for the Create Product request
export interface CreateProductRequest {
  name: string;
  cost_price: number;
  gross_profit_percentage: number;
  shopee_category: "A" | "B" | "C" | "D" | "E";
}
// Types for update product request
export interface UpdateProductRequest {
  name: string;
  gross_profit_percentage: number;
  shopee_category: string;
  cost_price: number;
}
