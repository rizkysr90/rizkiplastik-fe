import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AuthProvider } from "./contexts/authContext";
import { TransactionProvider } from "./contexts/onlineTransactionContext";
import DashboardIndex from "./pages/dashboard/DashboardIndex";
import AutoInput from "./pages/dashboard/onlinetransactions/AutoInput";
import { OnlineTransactionDetailPage } from "./pages/dashboard/onlinetransactions/DetailOnlineTransaction";
import OnlineTransaction from "./pages/dashboard/onlinetransactions/OnlineTransaction";
import CreateProduct from "./pages/dashboard/products/Create";
import EditProduct from "./pages/dashboard/products/Edit";
import Products from "./pages/dashboard/products/Products";
import Settings from "./pages/dashboard/Settings";
import LoginPage from "./pages/Login";

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardIndex />
                </ProtectedRoute>
              }
            >
              {/* Nested routes for dashboard content */}
              <Route path="products" element={<Products />} />
              <Route path="products/create" element={<CreateProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              {/* <Route path="products/:id" element={<ProductDetail />} /> */}

              <Route
                path="online-transactions"
                element={<OnlineTransaction />}
              />
              <Route
                path="online-transactions/:id"
                element={<OnlineTransactionDetailPage />}
              />
              <Route
                path="online-transactions/auto-input"
                element={<AutoInput />}
              />
              <Route path="settings" element={<Settings />} />
              {/* Redirect to products by default */}
              <Route index element={<Navigate to="products" replace />} />
            </Route>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;
