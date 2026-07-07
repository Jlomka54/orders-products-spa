import { createSelector } from "@reduxjs/toolkit";
import {
  getOrderId,
  getOrderProducts,
  isSameOrder,
} from "../../utils/orderHelpers";
import { getProductId } from "../../utils/productHelpers";

export const selectOrders = (state) => state.orders.items;

export const selectOrdersLoading = (state) => state.orders.isLoading;

export const selectOrdersError = (state) => state.orders.error;

export const selectOrdersMutationLoading = (state) =>
  state.orders.mutationLoading;

export const selectSelectedOrderId = (state) => state.orders.selectedOrderId;

export const selectSelectedOrderDetails = (state) =>
  state.orders.selectedOrderDetails;

export const selectOrderFormOpen = (state) => state.orders.isOrderFormOpen;

export const selectOrderFormMode = (state) => state.orders.orderFormMode;

export const selectEditingOrder = (state) => state.orders.editingOrder;

export const selectDeleteModalOrderId = (state) =>
  state.orders.deleteModalOrderId;

export const selectIsProductLinking = (state) =>
  state.orders.isProductLinking;

export const selectProductLinkingError = (state) =>
  state.orders.productLinkingError;

export const selectSelectedOrder = (state) =>
  state.orders.items.find(
    (order) => isSameOrder(getOrderId(order), state.orders.selectedOrderId),
  ) || null;

export const selectSelectedGroup = (state) =>
  selectSelectedOrderDetails(state) || selectSelectedOrder(state);

export const selectSelectedGroupProducts = createSelector(
  [selectSelectedGroup],
  (selectedGroup) => getOrderProducts(selectedGroup),
);

export const selectGroupProductIds = createSelector(
  [selectSelectedGroupProducts],
  (products) =>
    products
      .map((product) => getProductId(product))
      .filter((productId) => productId !== null && productId !== undefined),
);

export const selectDeleteModalOrder = (state) =>
  state.orders.items.find(
    (order) => isSameOrder(getOrderId(order), state.orders.deleteModalOrderId),
  ) || null;
