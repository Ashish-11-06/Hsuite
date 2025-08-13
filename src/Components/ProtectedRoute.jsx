// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";
// import React from "react";

// const ProtectedRoute = ({ children }) => {
// //   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

// //   return isAuthenticated ? children : <Navigate to="/login" replace />;
// // };
//  const user = localStorage.getItem("user");
//   return user ? children : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;


// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const userJSON = localStorage.getItem("user");
  if (!userJSON) {
    return <Navigate to="/login" replace />;
  }
  const user = JSON.parse(userJSON);

if (
  allowedRoles.length &&
  !allowedRoles.some(role => role.toLowerCase() === user.role.toLowerCase())
) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

export default ProtectedRoute;

