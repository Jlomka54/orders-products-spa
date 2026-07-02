import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated } from "../features/auth/authSelectors";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
