import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteOrderApi,
  getOrderByIdApi,
  getOrdersWithDetailsApi,
} from "../../api/ordersApi";
import { createProductApi } from "../../api/productsApi";
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

export const addProductToOrder = createAsyncThunk(
  "orders/addProductToOrder",
  async ({ orderId, product }, { rejectWithValue }) => {
    try {
      await createProductApi(product);

      return {
        orderId,
        selectedOrderDetails: await getOrderByIdApi(orderId),
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
  isLoading: false,
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
      .addCase(addProductToOrder.pending, setPendingState)
      .addCase(addProductToOrder.fulfilled, (state, action) => {
        const { orderId, selectedOrderDetails } = action.payload;
        const normalizedOrderDetails = normalizeOrder(selectedOrderDetails);

        state.selectedOrderDetails = normalizedOrderDetails;
        state.items = state.items.map((order) =>
          isSameOrder(getOrderId(order), orderId)
            ? {
                ...order,
                ...normalizedOrderDetails,
              }
            : order,
        );
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addProductToOrder.rejected, setRejectedState);
  },
});

export const {
  setSelectedOrderId,
  clearSelectedOrder,
  openDeleteModal,
  closeDeleteModal,
} = ordersSlice.actions;

export default ordersSlice.reducer;
