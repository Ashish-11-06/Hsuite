import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import React from "react";

const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };
 const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
