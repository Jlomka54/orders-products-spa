import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteProductApi,
  getProductsApi,
  updateProductApi,
} from "../../api/productsApi";

const getProductId = (product) => product?._id ?? product?.id ?? null;

const isSameProduct = (firstId, secondId) => {
  if (
    firstId === null ||
    firstId === undefined ||
    secondId === null ||
    secondId === undefined
  ) {
    return false;
  }

  return String(firstId) === String(secondId);
};

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

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, product }, { rejectWithValue }) => {
    try {
      const response = await updateProductApi(productId, product);

      return response.product ?? response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await deleteProductApi(productId);

      return {
        productId,
        product: response.product,
      };
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
      .addCase(fetchProducts.rejected, setRejectedState)
      .addCase(updateProduct.pending, setPendingState)
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const updatedProductId = getProductId(updatedProduct);

        state.items = state.items.map((product) =>
          isSameProduct(getProductId(product), updatedProductId)
            ? updatedProduct
            : product,
        );
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateProduct.rejected, setRejectedState)
      .addCase(removeProduct.pending, setPendingState)
      .addCase(removeProduct.fulfilled, (state, action) => {
        const removedProductId =
          action.payload.productId ?? getProductId(action.payload.product);

        state.items = state.items.filter(
          (product) => !isSameProduct(getProductId(product), removedProductId),
        );
        state.isLoading = false;
        state.error = null;
      })
      .addCase(removeProduct.rejected, setRejectedState);
  },
});

export const {
  setSelectedType,
  setSelectedSpecification,
  resetFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
