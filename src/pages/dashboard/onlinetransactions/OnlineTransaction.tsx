import { useState } from "react";
import { months, TRANSACTION_TYPES } from "../../../constant/constant";
import { useAuth } from "../../../contexts/authContext";
import { useOnlineTransactionsWithPagination } from "../../../hooks/onlintransactions";
import { OnlineTransactionsQueryParams } from "../../../types/services/onlineTransaction";
import { formatDate } from "../../../utils/date";
import { formatToRupiah } from "../../../utils/number";

const OnlineTransaction = () => {
  const { token } = useAuth();
  // State for query parameters
  const [queryParams, setQueryParams] = useState<OnlineTransactionsQueryParams>(
    {
      page_number: 0,
      page_size: 10,
      type: undefined,
      order_number: undefined,
      period_month: undefined,
      period_year: undefined,
      created_by: undefined,
      start_date: undefined,
      end_date: undefined,
    }
  );
  // Years for the filter dropdown (current year and 3 years back)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

  // Fetch transactions with TanStack Query
  const { data, isLoading, isError } = useOnlineTransactionsWithPagination(
    queryParams,
    token || undefined
  );

  // Extract data and metadata from the query result
  const transactions = data?.data || [];

  const metadata = data?.metadata || {
    page_number: 0,
    page_size: 10,
    total_count: 0,
    total_pages: 0,
  };
  // Handle filter changes
  const handleFilterChange = (
    name: keyof OnlineTransactionsQueryParams,
    value: any
  ) => {
    setQueryParams((prev) => ({
      ...prev,
      [name]: value,
      // Reset to page 0 when filters change (except when page_number itself is changing)
      page_number: name === "page_number" ? value : 0,
    }));
  };
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page_number: newPage,
    }));
  };
  // Handle page size change
  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSize = parseInt(event.target.value, 10);
    setQueryParams((prev) => ({
      ...prev,
      page_size: newSize,
      page_number: 0, // Reset to first page when changing page size
    }));
  };
  // Reset filters
  const handleResetFilters = () => {
    setQueryParams({
      page_number: 1,
      page_size: queryParams.page_size, // Keep the current page size
      type: undefined,
      order_number: undefined,
      period_month: undefined,
      period_year: undefined,
      created_by: undefined,
      start_date: undefined,
      end_date: undefined,
    });
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Online Transactions</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Platform Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={queryParams.type || ""}
              onChange={(e) =>
                handleFilterChange("type", e.target.value || undefined)
              }
            >
              <option value="">All Platforms</option>
              {Object.values(TRANSACTION_TYPES).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={queryParams.period_month || ""}
              onChange={(e) =>
                handleFilterChange(
                  "period_month",
                  e.target.value ? parseInt(e.target.value, 10) : undefined
                )
              }
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={queryParams.period_year || ""}
              onChange={(e) =>
                handleFilterChange(
                  "period_year",
                  e.target.value ? parseInt(e.target.value, 10) : undefined
                )
              }
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Order Number Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Number
            </label>
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Search by order #"
              value={queryParams.order_number || ""}
              onChange={(e) =>
                handleFilterChange("order_number", e.target.value || undefined)
              }
            />
          </div>

          {/* Reset Filters Button */}
          <div className="flex items-end">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : isError ? (
          <div className="p-4 text-red-500 text-center">
            An error occurred while loading transactions. Please try again
            later.
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No transactions found. Try adjusting your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Platform
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Period
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Base Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sale Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Net Profit
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fee Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
                          transaction.type === "SHOPEE"
                            ? "bg-orange-100 text-orange-800"
                            : ""
                        }
                        ${
                          transaction.type === "LAZADA"
                            ? "bg-blue-100 text-blue-800"
                            : ""
                        }
                        ${
                          transaction.type === "TOKOPEDIA"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                        ${
                          transaction.type === "TIKTOK"
                            ? "bg-gray-100 text-gray-800"
                            : ""
                        }
                      `}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.created_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {
                        months.find((m) => m.value === transaction.period_month)
                          ?.label
                      }{" "}
                      {transaction.period_year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatToRupiah(transaction.total_base_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatToRupiah(transaction.total_sale_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span
                        className={
                          transaction.total_net_profit >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {formatToRupiah(transaction.total_net_profit)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatToRupiah(transaction.total_fee_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        href={`/dashboard/online-transactions/${transaction.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        View
                      </a>
                      <a
                        href={`/online-transactions/${transaction.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Simplified Pagination controls */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200">
          <div className="mb-4 sm:mb-0 text-sm text-gray-600">
            Showing page {metadata.page_number} of {metadata.total_pages || 1}{" "}
            pages
          </div>
          <div className="flex gap-2">
            <select
              value={queryParams.page_size}
              onChange={handlePageSizeChange}
              className="mr-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
            <button
              className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100 transition-colors"
              onClick={() => handlePageChange(metadata.page_number - 1)}
              disabled={metadata.page_number <= 1}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100 transition-colors"
              onClick={() => handlePageChange(metadata.page_number + 1)}
              disabled={
                transactions.length < metadata.page_size ||
                metadata.page_number >= metadata.total_pages
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineTransaction;
