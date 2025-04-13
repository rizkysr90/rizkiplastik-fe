import { PaginationResponseV2 } from "./pagination";

// Online Transaction Type constants
export type OnlineTransactionType =
  | "SHOPEE"
  | "LAZADA"
  | "TOKOPEDIA"
  | "TIKTOK";

// OnlineTransactionProduct interface - assuming structure based on context
export interface OnlineTransactionProduct {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  cost_price: number;
  sale_price: number;
  fee_amount: number;
}

// OnlineTransaction represents an online transaction entity
export interface OnlineTransaction {
  id: string; // UUID
  type: OnlineTransactionType;
  order_number: string;
  created_date: string; // ISO date string
  period_month: number;
  period_year: number;
  total_base_amount: number;
  total_sale_amount: number;
  total_net_profit: number;
  total_fee_amount: number;
  created_by: string;
  products?: OnlineTransactionProduct[];
}

// Get online transactions response matching Go's GetOnlineTransactionsResponse
export interface GetOnlineTransactionsResponse {
  metadata: PaginationResponseV2;
  data: OnlineTransaction[];
}

// Get online transaction by ID response matching Go's GetOnlineTransactionResponse
export interface GetOnlineTransactionResponse {
  data: OnlineTransaction;
}

// Optional query parameters for fetching online transactions
export interface OnlineTransactionsQueryParams {
  page_number?: number;
  page_size?: number;
  type?: OnlineTransactionType;
  order_number?: string;
  period_month?: number;
  period_year?: number;
  created_by?: string;
  start_date?: string; // ISO date string
  end_date?: string; // ISO date string
}

// Types for the Create Online Transaction request
export interface CreateOnlineTransactionRequest {
  type: OnlineTransactionType;
  order_number: string;
  period_month: number;
  period_year: number;
  products: {
    product_id: string;
    quantity: number;
    base_amount: number;
    sale_amount: number;
    fee_amount: number;
  }[];
}

// Types for update online transaction request
export interface UpdateOnlineTransactionRequest {
  type?: OnlineTransactionType;
  order_number?: string;
  period_month?: number;
  period_year?: number;
  products?: {
    id?: string; // Only required for existing products
    product_id: string;
    quantity: number;
    base_amount: number;
    sale_amount: number;
    fee_amount: number;
  }[];
}
