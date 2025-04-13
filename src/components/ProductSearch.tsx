// ProductSearch.tsx
import React from "react";

interface ProductSearchProps {
  searchValue: string;
  onSearchInputChange: (value: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  searchValue,
  onSearchInputChange,
}) => {
  return (
    <div className="w-full mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchInputChange(e.target.value)}
          className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search products by name..."
        />
      </div>
    </div>
  );
};
export default ProductSearch;
