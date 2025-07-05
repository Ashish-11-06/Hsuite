// Demo/Components/ProtectedRouteDemo.jsx
import { Navigate } from "react-router-dom";

const ProtectedRouteDemo = ({ children }) => {
  const user = localStorage.getItem("HMS-user");

  // if (!user) {
  //   return <Navigate to="/demo/logindemo" replace />;
  // }
  return user?children : <Navigate to="/demo/logindemo" replace />

  return children;
};

export default ProtectedRouteDemo;
