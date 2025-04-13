import { formatToRupiah } from "../utils/number";

export interface ProductCardProps {
  id: string;
  name: string;
  costPrice: number;
  shopeePrice: number;
  shopeeCategory: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddToTransaction?: (id: string) => void; // New prop for adding to transaction
}

const Card: React.FC<ProductCardProps> = ({
  id,
  name,
  costPrice,
  shopeePrice,
  shopeeCategory,
  onEdit,
  onDelete,
  onAddToTransaction,
}) => {
  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      {/* Category Badge */}
      <div className="absolute top-0 right-0 m-2">
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
          {shopeeCategory}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 mb-2 truncate">{name}</h3>

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Cost:</span>
            <span className="font-medium text-gray-900">
              {formatToRupiah(costPrice)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Shopee:</span>
            <span className="font-medium text-green-600">
              {formatToRupiah(shopeePrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
        <div className="flex gap-3">
          <button
            onClick={() => onEdit && onEdit(id)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete && onDelete(id)}
            className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
          >
            Delete
          </button>
        </div>

        {/* Add to Transaction button */}
        {onAddToTransaction && (
          <button
            onClick={() => onAddToTransaction(id)}
            className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors flex items-center"
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
        )}
      </div>
    </div>
  );
};

export default Card;
