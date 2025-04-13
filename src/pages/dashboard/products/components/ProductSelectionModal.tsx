// components/ProductSelectionModal.tsx
import React, { useState } from "react";
import { formatRupiah } from "../../../../utils/number";
import Modal from "./../../../../components/Modal";
import { Product } from "./../../../../types/services/products";

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToTransaction: (
    productId: string,
    productName: string,
    quantity: number
  ) => void;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToTransaction,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) return null;

  const handleSubmit = () => {
    onAddToTransaction(product.id.toString(), product.name, quantity);
    setQuantity(1); // Reset the quantity
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add to Transaction"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
          >
            Add to Transaction
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h3 className="font-medium text-lg">{product.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Category: {product.shopee_category}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700">Cost Price:</span>
          <span className="font-medium">
            {formatRupiah(product.cost_price)}
          </span>
        </div>

        {product.shopee_sale_price && (
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Shopee Price:</span>
            <span className="font-medium text-green-600">
              {formatRupiah(product.shopee_sale_price)}
            </span>
          </div>
        )}

        <div className="pt-4 border-t">
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Quantity:
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value >= 1) {
                setQuantity(value);
              }
            }}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ProductSelectionModal;
