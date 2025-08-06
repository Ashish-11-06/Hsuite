// Demo/Components/ProtectedRouteDemo.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoutePatient = ({ children }) => {
  const user = localStorage.getItem("patient-user");

  // if (!user) {
  //   return <Navigate to="/demo/logindemo" replace />;
  // }
  return user?children : <Navigate to="/demo/:hospitalId/patientregistration" replace />

  return children;
};

export default ProtectedRoutePatient;
