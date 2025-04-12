import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/Card";
import { useAuth } from "../../../contexts/authContext";
import { useProductsWithPagination } from "../../../hooks/product";
import { ProductCardProps } from "../../../types/products";
import { Product, ProductsQueryParams } from "../../../types/services/products";

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); // State for pagination
  const [queryParams, setQueryParams] = useState<ProductsQueryParams>({
    page_number: 0,
    page_size: 10,
  });

  // Fetch products with pagination using TanStack Query
  const { data, isLoading, isError, error } = useProductsWithPagination(
    queryParams,
    token || undefined
  );
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page_number: newPage,
    }));
  };

  if (isLoading) {
    return (
      <div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p>Error loading products: {error.message}</p>
      </div>
    );
  }

  // Extract pagination metadata and products
  const { metadata, data: products } = data || {
    metadata: { page_number: 0, page_size: 10 },
    data: [],
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Products</h1>
        <button
          onClick={() => navigate("/dashboard/products/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
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
          Create Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products &&
          products.map((product: Product) => {
            const productProps: ProductCardProps = {
              id: product.id,
              name: product.name,
              costPrice: product.cost_price,
              shopeePrice: product.shopee_sale_price,
              shopeeCategory: product.shopee_category,
            };

            return <Card key={product.id} {...productProps} />;
          })}
      </div>

      {/* Pagination controls */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0 text-sm text-gray-600">
          Showing page {metadata.page_number} of products
        </div>
        <div className="flex gap-2">
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
            disabled={products.length < metadata.page_size}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
