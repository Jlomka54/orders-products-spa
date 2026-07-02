import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProductsApi } from "../../api/productsApi";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params, { getState, rejectWithValue }) => {
    try {
      const { selectedType, selectedSpecification } = getState().products;
      const requestParams = {
        type: selectedType === "all" ? undefined : selectedType,
        specification:
          selectedSpecification === "all" ? undefined : selectedSpecification,
        ...params,
      };

      return await getProductsApi(requestParams);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  items: [],
  selectedType: "all",
  selectedSpecification: "all",
  isLoading: false,
  error: null,
};

const setPendingState = (state) => {
  state.isLoading = true;
  state.error = null;
};

const setRejectedState = (state, action) => {
  state.isLoading = false;
  state.error = action.payload || action.error.message || "Products request failed";
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedType: (state, action) => {
      state.selectedType = action.payload;
    },
    setSelectedSpecification: (state, action) => {
      state.selectedSpecification = action.payload;
    },
    resetFilters: (state) => {
      state.selectedType = "all";
      state.selectedSpecification = "all";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, setPendingState)
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, setRejectedState);
  },
});

export const {
  setSelectedType,
  setSelectedSpecification,
  resetFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
