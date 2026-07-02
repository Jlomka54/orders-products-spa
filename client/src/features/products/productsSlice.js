import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  selectedType: "all",
  selectedSpecification: "all",
  isLoading: false,
  error: null,
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
});

export const {
  setSelectedType,
  setSelectedSpecification,
  resetFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
