import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card, { ProductCardProps } from "../../../components/Card";
import Modal from "../../../components/Modal";
import { NotificationToast } from "../../../components/Notification";
import ProductSearch from "../../../components/ProductSearch";
import { useAuth } from "../../../contexts/authContext";
import { useTransaction } from "../../../contexts/onlineTransactionContext";
import useNotification from "../../../hooks/notification";
import {
  useDeleteProduct,
  useProductsWithPagination,
} from "../../../hooks/product";
import { useDebounce } from "../../../hooks/useDebounce";
import { Product, ProductsQueryParams } from "../../../types/services/products";
import ProductSelectionModal from "./components/ProductSelectionModal";
import TransactionCart from "./components/TransactionCart";

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [searchName, setSearchName] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchName, 500);
  // Transaction context
  const { addProduct } = useTransaction();
  // State for cart modal
  const [isCartOpen, setIsCartOpen] = useState(false);
  // State for pagination
  const [queryParams, setQueryParams] = useState<ProductsQueryParams>({
    page_number: 0,
    page_size: 10,
    name: "", // Add name filter
  });
  // State for product selection modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
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
  // Handle opening the product selection modal
  const handleOpenSelectionModal = (productId: string) => {
    const product = products.find((p) => p.id.toString() === productId);
    if (product) {
      setSelectedProduct(product);
      setIsSelectionModalOpen(true);
    }
  };
  // Handle adding product to transaction
  const handleAddToTransaction = (
    productId: string,
    productName: string,
    quantity: number
  ) => {
    addProduct({
      product_id: productId,
      product_name: productName,
      quantity: quantity,
    });

    const product = products.find((p) => p.id.toString() === productId);
    if (product) {
      showNotification(`Added ${product.name} to transaction`, "success");
    }
  };
  // Calculate cart items count
  const cartItemsCount = useTransaction().transaction.products.length;
  // Extract pagination metadata and products
  const { metadata, data: products } = data || {
    metadata: { page_number: 0, page_size: 10 },
    data: [],
  };
  // Delete product functionality
  // Function to show notification
  const { notification, hideNotification, showNotification } =
    useNotification();

  const {
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    isDeleting,
  } = useDeleteProduct({
    onSuccess: () => {
      showNotification("Product deleted successfully", "success");
    },
    onError: (error) => {
      showNotification(`Error deleting product: ${error.message}`, "error");
    },
    token: token || undefined,
  });
  // Effect to update query params when search term changes
  useEffect(() => {
    setQueryParams((prevParams) => ({
      ...prevParams,
      name: debouncedSearchTerm,
      page_number: 0, // Reset to first page on new search
    }));
  }, [debouncedSearchTerm]);
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
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Notification */}
      {notification.show && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 w-full">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Products</h1>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Transaction Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center relative"
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Transaction
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Create Product Button */}
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
      </div>
      {/* Search Component with lifted state */}
      <ProductSearch
        searchValue={searchName}
        onSearchInputChange={setSearchName}
      />
      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products && products.length > 0 ? (
          products.map((product: Product) => {
            const productProps: ProductCardProps = {
              id: product.id.toString(),
              name: product.name,
              costPrice: product.cost_price,
              shopeePrice: product.shopee_sale_price,
              shopeeCategory: product.shopee_category,
              onEdit: () => navigate(`/dashboard/products/edit/${product.id}`),
              onDelete: openDeleteModal,
              onAddToTransaction: handleOpenSelectionModal,
            };

            return <Card key={product.id.toString()} {...productProps} />;
          })
        ) : (
          <div className="col-span-3 py-10 text-center text-gray-500">
            {queryParams.name ? (
              <p>
                No products found matching "{queryParams.name}". Try a different
                search term.
              </p>
            ) : (
              <p>No products available. Click "Create Product" to add one.</p>
            )}
          </div>
        )}
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
      {/* Product Selection Modal */}
      <ProductSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        product={selectedProduct}
        onAddToTransaction={handleAddToTransaction}
      />
      {/* Transaction Cart Modal */}
      <TransactionCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Delete"
        footer={
          <>
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to delete this product? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
};

export default Products;
