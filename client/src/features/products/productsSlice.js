import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createProductApi,
  deleteProductApi,
  getProductsApi,
  updateProductApi,
} from "../../api/productsApi";
import {
  getProductId,
  getProductRequestId,
  isSameProduct,
  normalizeProduct,
} from "../../utils/productHelpers";

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

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productPayload, { rejectWithValue }) => {
    try {
      const response = await createProductApi(productPayload);

      return response.product || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, productPayload }, { rejectWithValue }) => {
    try {
      const response = await updateProductApi(productId, productPayload);

      return response.product || response;
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

      return { productId, response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  items: [],
  selectedType: "all",
  selectedSpecification: "all",
  selectedProductId: null,
  isProductFormOpen: false,
  productFormMode: "create",
  editingProduct: null,
  deleteModalProductId: null,
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
  state.error = action.payload || action.error.message || "Products request failed";
};

const setMutationPendingState = (state) => {
  state.mutationLoading = true;
  state.error = null;
};

const setMutationRejectedState = (state, action) => {
  state.mutationLoading = false;
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
    openCreateProductModal: (state) => {
      state.isProductFormOpen = true;
      state.productFormMode = "create";
      state.editingProduct = null;
      state.selectedProductId = null;
    },
    openEditProductModal: (state, action) => {
      state.isProductFormOpen = true;
      state.productFormMode = "edit";
      state.editingProduct = action.payload;
      state.selectedProductId = getProductId(action.payload);
    },
    closeProductFormModal: (state) => {
      state.isProductFormOpen = false;
      state.editingProduct = null;
      state.selectedProductId = null;
    },
    openDeleteProductModal: (state, action) => {
      state.deleteModalProductId = action.payload;
    },
    closeDeleteProductModal: (state) => {
      state.deleteModalProductId = null;
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
      .addCase(createProduct.pending, setMutationPendingState)
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(normalizeProduct(action.payload));
        state.isProductFormOpen = false;
        state.editingProduct = null;
        state.selectedProductId = null;
        state.mutationLoading = false;
        state.error = null;
      })
      .addCase(createProduct.rejected, setMutationRejectedState)
      .addCase(updateProduct.pending, setMutationPendingState)
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct = normalizeProduct(action.payload);
        const updatedProductId =
          getProductRequestId(updatedProduct) ?? action.meta.arg.productId;

        state.items = state.items.map((product) =>
          isSameProduct(getProductId(product), updatedProductId)
            ? updatedProduct
            : product,
        );
        state.isProductFormOpen = false;
        state.editingProduct = null;
        state.selectedProductId = null;
        state.mutationLoading = false;
        state.error = null;
      })
      .addCase(updateProduct.rejected, setMutationRejectedState)
      .addCase(removeProduct.pending, setMutationPendingState)
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (product) =>
            !isSameProduct(
              getProductRequestId(product),
              action.payload.productId,
            ),
        );
        state.deleteModalProductId = null;
        state.mutationLoading = false;
        state.error = null;
      })
      .addCase(removeProduct.rejected, setMutationRejectedState);
  },
});

export const {
  closeDeleteProductModal,
  closeProductFormModal,
  openCreateProductModal,
  openDeleteProductModal,
  openEditProductModal,
  setSelectedType,
  setSelectedSpecification,
  resetFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
