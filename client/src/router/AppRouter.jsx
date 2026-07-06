import { Navigate, Route, Routes } from "react-router-dom";
import GroupsPage from "../pages/GroupsPage/GroupsPage";
import OrdersPage from "../pages/OrdersPage/OrdersPage";
import { ProductsPage } from "../pages/ProductsPage/ProductsPage";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";
import MainLayout from "../layouts/MainLayout/MainLayout";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../features/auth/authSelectors";

const RootRedirect = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Navigate to={isAuthenticated ? "/orders" : "/login"} replace />
  );
};

const AppRouter = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/products" element={<ProductsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
