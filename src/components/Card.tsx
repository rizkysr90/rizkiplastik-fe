import { ProductCardProps } from "../types/products";
import { formatToRupiah } from "../utils/number";

const Card: React.FC<ProductCardProps> = ({
  id,
  name,
  costPrice,
  shopeePrice,
  shopeeCategory,
  onEdit,
  onDelete,
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
    </div>
  );
};

export default Card;
