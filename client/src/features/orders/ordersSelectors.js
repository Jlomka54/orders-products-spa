export const selectOrders = (state) => state.orders.items;

export const selectOrdersLoading = (state) => state.orders.isLoading;

export const selectOrdersError = (state) => state.orders.error;

export const selectSelectedOrderId = (state) => state.orders.selectedOrderId;

export const selectSelectedOrderDetails = (state) =>
  state.orders.selectedOrderDetails;

export const selectDeleteModalOrderId = (state) =>
  state.orders.deleteModalOrderId;

export const selectSelectedOrder = (state) =>
  state.orders.items.find(
    (order) =>
      String(order.id || order._id) === String(state.orders.selectedOrderId),
  ) || null;
