// components/TransactionCart.tsx
import React, { useState } from "react";
import { TRANSACTION_TYPES } from "../../../../constant/constant";
import { useAuth } from "./../../../../contexts/authContext";
import { useTransaction } from "./../../../../contexts/onlineTransactionContext";
interface TransactionCartProps {
  isOpen: boolean;
  onClose: () => void;
}
const TransactionCart: React.FC<TransactionCartProps> = ({
  isOpen,
  onClose,
}) => {
  const API_URL =
    import.meta.env.VITE_BASE_URL_RIZKIPLASTIK_BE || "http://localhost:8080";
  const { token } = useAuth();
  const {
    transaction,
    updateTransaction,
    removeProduct,
    updateProduct,
    resetTransaction,
    submitTransaction,
  } = useTransaction();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await submitTransaction(`${API_URL}/api/v1/online-transactions`, token);
      setSuccess("Transaction submitted successfully!");
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity >= 1) {
      updateProduct(index, { quantity });
    }
  };

  const totalItems = transaction.products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Transaction Cart ({totalItems} items)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}

          <div className="space-y-4">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Type *
              </label>
              <select
                value={transaction.type}
                onChange={(e) =>
                  updateTransaction({ type: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                required
              >
                <option value="">Select Transaction Type</option>
                {Object.values(TRANSACTION_TYPES).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Order Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Number *
              </label>
              <input
                type="text"
                value={transaction.order_number}
                onChange={(e) =>
                  updateTransaction({ order_number: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                placeholder="Enter order number"
                required
              />
            </div>

            {/* Created Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created Date *
              </label>
              <input
                type="date"
                value={transaction.created_date}
                onChange={(e) =>
                  updateTransaction({ created_date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                required
              />
            </div>

            {/* Product List */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Products
              </h3>

              {transaction.products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No products added yet. Add products from the product list.
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-auto pr-2">
                  {transaction.products.map((product, index) => (
                    <div
                      key={`${product.product_id}-${index}`}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {product.product_name}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <label className="sr-only">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              index,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
                        />

                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m5-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="border-t px-6 py-4 flex justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Are you sure you want to clear all items?")) {
                resetTransaction();
              }
            }}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium"
            disabled={transaction.products.length === 0 || isSubmitting}
          >
            Clear All
          </button>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              disabled={transaction.products.length === 0 || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Transaction"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCart;
