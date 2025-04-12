import { useQuery } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RupiahInput from "../../../components/common/RupiahInput";
import PercentageInput from "../../../components/inputs/PercentageInput";
import SelectInput from "../../../components/inputs/SelectInputShopeeCategory";
import { SHOPEE_CATEGORIES } from "../../../constants/constants";
import { useAuth } from "../../../contexts/authContext";
import { fetchProductById } from "../../../services/products";
import { UpdateProductRequest } from "../../../types/services/products";
import ProductTextInput from "./components/ProductTextInput";

const EditProduct = () => {
  const API_URL =
    import.meta.env.VITE_BASE_URL_RIZKIPLASTIK_BE || "http://localhost:8080";
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<UpdateProductRequest>({
    name: "",
    gross_profit_percentage: 0,
    shopee_category: "A",
    cost_price: 0,
  });

  // Fetch product data
  const {
    data: product,
    isLoading: isLoadingProduct,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id || "", token || undefined),
    enabled: !!id,
  });
  // Update form data when product data is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        gross_profit_percentage: product.gross_profit_percentage,
        shopee_category: product.shopee_category,
        cost_price: product.cost_price,
      });
    }
  }, [product]);

  // Handle input changes
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: any; type?: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "gross_profit_percentage" || name === "cost_price"
          ? parseFloat(value)
          : value,
    }));
  };
  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      if (!id) {
        throw new Error("Product ID is missing");
      }

      const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      // Successfully updated product, navigate back to products list
      navigate("/dashboard/products");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };
  // Show loading state while fetching product data
  if (isLoadingProduct) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  // Show error if fetching product failed
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>
            Error loading product:{" "}
            {fetchError instanceof Error ? fetchError.message : "Unknown error"}
          </p>
          <button
            onClick={() => navigate("/dashboard/products")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="text-gray-600">Update the product details</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <ProductTextInput
            id="name"
            name="name"
            label="Product Name"
            value={formData.name}
            onChange={handleChange}
            maxLength={50}
            required
            error={""}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="cost_price"
                className="block text-gray-700 font-medium mb-2"
              >
                Cost Price*
              </label>
              <RupiahInput
                name="cost_price"
                value={product?.cost_price || 0}
                onChange={handleChange}
              />
            </div>

            <PercentageInput
              id="gross_profit_percentage"
              name="gross_profit_percentage"
              label="Gross Profit Percentage"
              value={formData.gross_profit_percentage}
              onChange={handleChange}
              required
              min={0}
              max={100}
              step="0.1"
              error={""}
              helperText="Enter a value between 0% and 100%"
            />
          </div>

          {product?.shopee_sale_price && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Shopee Sale Price (Auto-calculated)
              </label>
              <div className="px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700">
                Rp {product.shopee_sale_price.toLocaleString("id-ID")}
              </div>
            </div>
          )}

          {product?.shopee_sale_price && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Shopee Fee (Auto-calculated)
              </label>
              <div className="px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700">
                Rp {product.shopee_sale_price.toLocaleString("id-ID")}
              </div>
            </div>
          )}

          <SelectInput
            id="shopee_category"
            name="shopee_category"
            label="Shopee Category"
            value={formData.shopee_category}
            onChange={handleChange}
            options={SHOPEE_CATEGORIES}
            required
            error={""}
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate("/dashboard/products")}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
