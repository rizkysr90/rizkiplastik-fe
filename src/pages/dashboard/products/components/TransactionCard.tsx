// components/TransactionCard.tsx
import React, { useState } from "react";
import { Product } from "./../../.././../types/services/products";

interface TransactionCardProps {
  product: Product;
  onAddToTransaction: (product: Product, quantity: number) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  product,
  onAddToTransaction,
  onEdit,
  onDelete,
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToTransaction = () => {
    onAddToTransaction(product, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          {product.name}
        </h3>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Cost Price:</span> $
            {product.cost_price.toFixed(2)}
          </p>
          {product.shopee_sale_price && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Shopee Price:</span> $
              {product.shopee_sale_price.toFixed(2)}
            </p>
          )}
          {product.shopee_category && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Shopee Category:</span>{" "}
              {product.shopee_category}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <label
            htmlFor={`quantity-${product.id}`}
            className="text-sm font-medium text-gray-700"
          >
            Quantity:
          </label>
          <input
            id={`quantity-${product.id}`}
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
          />
          <button
            onClick={handleAddToTransaction}
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add
          </button>
        </div>
      </div>

      <div className="flex border-t border-gray-200">
        {onEdit && (
          <button
            onClick={() => onEdit(product.id.toString())}
            className="flex-1 text-center py-2 text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(product.id.toString())}
            className="flex-1 text-center py-2 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium border-l border-gray-200"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
