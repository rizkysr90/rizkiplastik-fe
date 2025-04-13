// Define transaction types

import { createContext, useContext, useEffect, useState } from "react";
import { OnlineTransactionType } from "../types/services/onlineTransaction";

// Define transaction types

export interface TransactionProduct {
  product_id: string;
  product_name: string;
  quantity: number;
}

export interface OnlineTransaction {
  type: OnlineTransactionType;
  order_number: string;
  created_date: string; // Format: YYYY-MM-DD
  products: TransactionProduct[];
}
// Transaction context types
export interface TransactionContextType {
  transaction: OnlineTransaction;
  updateTransaction: (data: Partial<OnlineTransaction>) => void;
  addProduct: (product: TransactionProduct) => void;
  updateProduct: (
    index: number,
    updatedProduct: Partial<TransactionProduct>
  ) => void;
  removeProduct: (index: number) => void;
  resetTransaction: () => void;
  submitTransaction: (apiEndpoint: string, token: string) => Promise<any>;
  isSubmitting: boolean;
  error: string | null;
}

// Initial transaction state
const initialTransactionState: OnlineTransaction = {
  type: "" as OnlineTransactionType, // Type assertion for empty string
  order_number: "",
  created_date: "",
  products: [],
};

// Create context
const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

// Provider component
export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transaction, setTransaction] = useState(initialTransactionState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  // Load from localStorage on initial render
  useEffect(() => {
    const savedTransaction = localStorage.getItem("onlineTransaction");
    if (savedTransaction) {
      try {
        setTransaction(JSON.parse(savedTransaction));
      } catch (err) {
        console.error("Error parsing saved transaction:", err);
        localStorage.removeItem("onlineTransaction");
      }
    }
  }, []);

  // Save to localStorage whenever transaction changes
  useEffect(() => {
    if (transaction !== initialTransactionState) {
      localStorage.setItem("onlineTransaction", JSON.stringify(transaction));
    }
  }, [transaction]);

  // Update transaction data
  const updateTransaction = (data: Partial<OnlineTransaction>) => {
    setTransaction((prev) => ({ ...prev, ...data }));
  };
  // Add product to transaction
  const addProduct = (product: TransactionProduct) => {
    setTransaction((prev) => ({
      ...prev,
      products: [...prev.products, product],
    }));
  };
  // Update product in transaction
  const updateProduct = (
    index: number,
    updatedProduct: Partial<TransactionProduct>
  ) => {
    setTransaction((prev) => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = { ...updatedProducts[index], ...updatedProduct };
      return {
        ...prev,
        products: updatedProducts,
      };
    });
  };
  // Remove product from transaction
  const removeProduct = (index: number) => {
    setTransaction((prev) => {
      const updatedProducts = [...prev.products];
      updatedProducts.splice(index, 1);
      return {
        ...prev,
        products: updatedProducts,
      };
    });
  };
  // Reset transaction to initial state
  const resetTransaction = () => {
    setTransaction(initialTransactionState);
    localStorage.removeItem("onlineTransaction");
  };
  // Submit transaction to API
  const submitTransaction = async (
    apiEndpoint: string,
    token: string
  ): Promise<any> => {
    setIsSubmitting(true);
    setError("");

    try {
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit transaction");
      }

      const data = await response.json();
      resetTransaction();
      return data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };
  const contextValue = {
    transaction,
    updateTransaction,
    addProduct,
    updateProduct,
    removeProduct,
    resetTransaction,
    submitTransaction,
    isSubmitting,
    error,
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};
// Custom hook to use the transaction context
export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return context;
};
