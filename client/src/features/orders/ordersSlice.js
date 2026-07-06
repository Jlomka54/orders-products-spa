import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createOrderApi,
  deleteOrderApi,
  getOrderByIdApi,
  getOrdersWithDetailsApi,
  updateOrderApi,
} from "../../api/ordersApi";
import {
  getOrderId,
  isSameOrder,
  normalizeOrder,
} from "../../utils/orderHelpers";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersWithDetailsApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      return await getOrderByIdApi(orderId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderPayload, { rejectWithValue }) => {
    try {
      const response = await createOrderApi(orderPayload);

      return response.order || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ orderId, orderPayload }, { rejectWithValue }) => {
    try {
      const response = await updateOrderApi(orderId, orderPayload);

      return {
        orderId,
        order: response.order || response,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const removeOrder = createAsyncThunk(
  "orders/removeOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await deleteOrderApi(orderId);

      return {
        orderId,
        response,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  items: [],
  selectedOrderId: null,
  selectedOrderDetails: null,
  deleteModalOrderId: null,
  isOrderFormOpen: false,
  orderFormMode: "create",
  editingOrder: null,
  isLoading: false,
  mutationLoading: false,
  error: null,
};

const setPendingState = (state) => {
  state.isLoading = true;
  state.error = null;
};

const setRejectedState = (state, action) => {
  state.isLoading = false;
  state.error = action.payload || action.error.message || "Orders request failed";
};

const setMutationPendingState = (state) => {
  state.mutationLoading = true;
  state.error = null;
};

const setMutationRejectedState = (state, action) => {
  state.mutationLoading = false;
  state.error = action.payload || action.error.message || "Orders request failed";
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setSelectedOrderId: (state, action) => {
      state.selectedOrderId = action.payload;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrderId = null;
      state.selectedOrderDetails = null;
    },
    openDeleteModal: (state, action) => {
      state.deleteModalOrderId = action.payload;
    },
    closeDeleteModal: (state) => {
      state.deleteModalOrderId = null;
    },
    openCreateOrderModal: (state) => {
      state.isOrderFormOpen = true;
      state.orderFormMode = "create";
      state.editingOrder = null;
    },
    openEditOrderModal: (state, action) => {
      state.isOrderFormOpen = true;
      state.orderFormMode = "edit";
      state.editingOrder = action.payload;
    },
    closeOrderFormModal: (state) => {
      state.isOrderFormOpen = false;
      state.editingOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, setPendingState)
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload)
          ? action.payload.map((order) => normalizeOrder(order))
          : [];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, setRejectedState)
      .addCase(fetchOrderById.pending, setPendingState)
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.selectedOrderDetails = normalizeOrder(action.payload);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, setRejectedState)
      .addCase(removeOrder.pending, setPendingState)
      .addCase(removeOrder.fulfilled, (state, action) => {
        const removedOrderId = action.payload.orderId;

        state.items = state.items.filter(
          (order) => !isSameOrder(getOrderId(order), removedOrderId),
        );
        state.deleteModalOrderId = null;
        state.isLoading = false;
        state.error = null;

        if (isSameOrder(state.selectedOrderId, removedOrderId)) {
          state.selectedOrderId = null;
        }

        if (isSameOrder(getOrderId(state.selectedOrderDetails), removedOrderId)) {
          state.selectedOrderDetails = null;
        }
      })
      .addCase(removeOrder.rejected, setRejectedState)
      .addCase(createOrder.pending, setMutationPendingState)
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.push(normalizeOrder(action.payload));
        state.isOrderFormOpen = false;
        state.editingOrder = null;
        state.mutationLoading = false;
        state.error = null;
      })
      .addCase(createOrder.rejected, setMutationRejectedState)
      .addCase(updateOrder.pending, setMutationPendingState)
      .addCase(updateOrder.fulfilled, (state, action) => {
        const updatedOrderId = action.payload.orderId;
        const updatedOrder = normalizeOrder(action.payload.order);

        state.items = state.items.map((order) =>
          isSameOrder(getOrderId(order), updatedOrderId)
            ? updatedOrder
            : order,
        );

        if (
          isSameOrder(
            getOrderId(state.selectedOrderDetails),
            updatedOrderId,
          )
        ) {
          state.selectedOrderDetails = updatedOrder;
        }

        state.isOrderFormOpen = false;
        state.editingOrder = null;
        state.mutationLoading = false;
        state.error = null;
      })
      .addCase(updateOrder.rejected, setMutationRejectedState);
  },
});

export const {
  setSelectedOrderId,
  clearSelectedOrder,
  openDeleteModal,
  closeDeleteModal,
  openCreateOrderModal,
  openEditOrderModal,
  closeOrderFormModal,
} = ordersSlice.actions;

export default ordersSlice.reducer;
