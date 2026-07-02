import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  selectedOrderId: null,
  selectedOrderDetails: null,
  deleteModalOrderId: null,
  isLoading: false,
  error: null,
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
});

export const {
  setSelectedOrderId,
  clearSelectedOrder,
  openDeleteModal,
  closeDeleteModal,
} = ordersSlice.actions;

export default ordersSlice.reducer;
