import React from "react";

import { Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderReceipt from "./pages/OrderReceipt";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import SearchPage from "./pages/SearchPage";
import CategoryPage from "./pages/CategoryPage";

import { Toaster } from "sonner";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Admin Routes - Protected */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminOnly={true}>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/receipt" element={<OrderReceipt />} />

          {/* User Profile - Protected */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/products" element={<SearchPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
