// Types for the summary API
export interface RequestSummary {
    start_date: string; // ISO 8601 format
    end_date: string;   // ISO 8601 format
}

export interface DailyProfit {
    date: string;
    net_profit: number;
}

export interface ResponseSummary {
    total_net_profit: number;
    daily_profits: DailyProfit[];
}