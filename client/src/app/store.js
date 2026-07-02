import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import ordersReducer from "../features/orders/ordersSlice";
import productsReducer from "../features/products/productsSlice";
import uiReducer from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    products: productsReducer,
    ui: uiReducer,
  },
});
