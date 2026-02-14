import React from "react";
import { Navigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser } = useShop();

  const [isWait, setIsWait] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsWait(false), 150);
    return () => clearTimeout(timer);
  }, []);

  if (isWait) return null; // Wait for state to stabilize

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (
    adminOnly &&
    currentUser.role !== "admin" &&
    currentUser.role !== "staff"
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};
