import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import { useOnlineTransaction } from "../../../hooks/onlintransactions";
import { formatDate } from "../../../utils/date";
import { formatToRupiah } from "../../../utils/number";

export const OnlineTransactionDetailPage: React.FC = () => {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Get transaction data using TanStack Query
  const {
    data: transaction,
    isLoading,
    isError,
    error,
  } = useOnlineTransaction(id || "", token || undefined);

  // Handle back button click
  const handleBack = () => {
    navigate("/dashboard/online-transactions");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">
            {" "}
            Failed to load transaction details. {error?.message}
          </span>
          <button
            onClick={handleBack}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to List
          </button>
        </div>
      </div>
    );
  }
  if (!transaction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Not Found!</strong>
          <span className="block sm:inline">
            {" "}
            Transaction not found or may have been deleted.
          </span>
          <button
            onClick={handleBack}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to List
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <button
            onClick={handleBack}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Transactions
          </button>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => {}}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
          <button
            onClick={() => {}}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Transaction summary card */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Transaction Details
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Order Number</h3>
            <p className="mt-1 text-base font-semibold text-gray-900">
              {transaction.order_number}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Platform</h3>
            <p className="mt-1 text-base font-semibold text-gray-900">
              {transaction.type}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Created Date</h3>
            <p className="mt-1 text-base font-semibold text-gray-900">
              {formatDate(transaction.created_date)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Created By</h3>
            <p className="mt-1 text-base font-semibold text-gray-900">
              {transaction.created_by}
            </p>
          </div>
        </div>
      </div>

      {/* Financial summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow px-6 py-5">
          <h3 className="text-sm font-medium text-gray-500">Base Amount</h3>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            {formatToRupiah(transaction.total_base_amount)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow px-6 py-5">
          <h3 className="text-sm font-medium text-gray-500">Sale Amount</h3>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            {formatToRupiah(transaction.total_sale_amount)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow px-6 py-5">
          <h3 className="text-sm font-medium text-gray-500">Net Profit</h3>
          <p
            className={`mt-1 text-xl font-semibold ${
              transaction.total_net_profit >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {formatToRupiah(transaction.total_net_profit)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow px-6 py-5">
          <h3 className="text-sm font-medium text-gray-500">Fee Amount</h3>
          <p className="mt-1 text-xl font-semibold text-gray-900">
            {formatToRupiah(transaction.total_fee_amount)}
          </p>
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Products in this Transaction
          </h2>
        </div>
        {transaction.products && transaction.products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transaction.products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatToRupiah(product.cost_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatToRupiah(product.sale_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatToRupiah(product.fee_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-5 text-center text-gray-500">
            No products found for this transaction.
          </div>
        )}
      </div>
    </div>
  );
};
