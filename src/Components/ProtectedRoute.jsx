import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import React from "react";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  //console.log("🔍 Authenticated Status:", isAuthenticated); // Debugging

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
