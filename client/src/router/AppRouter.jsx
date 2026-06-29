import { Navigate, Route, Routes } from "react-router-dom";
import OrdersPage from "../pages/OrdersPage/OrdersPage";
import { ProductsPage } from "../pages/ProductsPage/ProductsPage";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";
import MainLayout from "../layouts/MainLayout/MainLayout";

const AppRouter = () => {
  return (
    <div>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default AppRouter;
