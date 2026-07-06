import {
  getOrderId,
  isSameOrder,
} from "../../utils/orderHelpers";

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

export const selectSelectedOrder = (state) =>
  state.orders.items.find(
    (order) => isSameOrder(getOrderId(order), state.orders.selectedOrderId),
  ) || null;

export const selectDeleteModalOrder = (state) =>
  state.orders.items.find(
    (order) => isSameOrder(getOrderId(order), state.orders.deleteModalOrderId),
  ) || null;
