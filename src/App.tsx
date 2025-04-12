import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AuthProvider } from "./contexts/authContext";
import DashboardIndex from "./pages/dashboard/DashboardIndex";
import CreateProduct from "./pages/dashboard/products/Create";
import Products from "./pages/dashboard/products/Products";
import Settings from "./pages/dashboard/Settings";
import LoginPage from "./pages/Login";

function App() {
  return (
    <AuthProvider>
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
            {/* <Route path="products/:id" element={<ProductDetail />} /> */}
            {/* <Route path="products/:id/edit" element={<EditProduct />} /> */}
            <Route path="settings" element={<Settings />} />
            {/* Redirect to products by default */}
            <Route index element={<Navigate to="products" replace />} />
          </Route>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
