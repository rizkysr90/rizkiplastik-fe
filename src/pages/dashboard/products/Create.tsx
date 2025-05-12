import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import RupiahInput from "../../../components/common/RupiahInput";
import PercentageInput from "../../../components/inputs/PercentageInput";
import SelectInput from "../../../components/inputs/SelectInputShopeeCategory";
import { SHOPEE_CATEGORIES } from "../../../constants/constants";
import { useAuth } from "../../../contexts/authContext";
import { CreateProductRequest } from "../../../types/services/products";
import ProductTextInput from "./components/ProductTextInput";

const CreateProduct = () => {
  const API_URL =
    import.meta.env.VITE_BASE_URL_RIZKIPLASTIK_BE || "http://localhost:8080";
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    cost_price: 0,
    gross_profit_percentage: 0,
    varian_gross_profit_percentage: undefined,
    shopee_category: "A",
    shopee_varian_name: "",
    shopee_name: "",
  });

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
        name === "cost_price" ||
          name === "gross_profit_percentage" ||
          name === "varian_gross_profit_percentage"
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

      const response = await fetch(`${API_URL}/api/v1/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      navigate("/dashboard/products");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Product</h1>
        <p className="text-gray-600">
          Fill in the details to create a new product
        </p>
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

          <ProductTextInput
            id="shopee_name"
            name="shopee_name"
            label="Shopee Name"
            value={formData.shopee_name}
            onChange={handleChange}
            maxLength={100}
            required
            error={""}
          />

          <ProductTextInput
            id="shopee_varian_name"
            name="shopee_varian_name"
            label="Shopee Varian Name"
            value={formData.shopee_varian_name || ""}
            onChange={handleChange}
            maxLength={100}
            error={""}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label
                htmlFor="cost_price"
                className="block text-gray-700 font-medium mb-2"
              >
                Cost Price*
              </label>
              <RupiahInput
                name="cost_price"
                value={formData.cost_price}
                onChange={handleChange}
                required
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

            <PercentageInput
              id="varian_gross_profit_percentage"
              name="varian_gross_profit_percentage"
              label="Varian Gross Profit Percentage"
              value={formData.varian_gross_profit_percentage || 0}
              onChange={handleChange}
              min={0}
              max={100}
              step="0.1"
              error={""}
              helperText="Optional: Enter a value between 0% and 100%"
            />
          </div>

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

          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
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
              {isLoading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
