import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  allowedRole,
  allowedRoles,
}) => {
  const { user, loading } = useAuth();

  const token = localStorage.getItem("token");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;