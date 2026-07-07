import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeSessions: 0,
  isSidebarOpen: false,
  searchQuery: "",
  isSearchOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveSessions: (state, action) => {
      state.activeSessions = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.isSearchOpen = String(action.payload).trim() !== "";
    },
    clearSearchQuery: (state) => {
      state.searchQuery = "";
      state.isSearchOpen = false;
    },
    openSearch: (state) => {
      state.isSearchOpen = true;
    },
    closeSearch: (state) => {
      state.isSearchOpen = false;
    },
  },
});

export const {
  setActiveSessions,
  toggleSidebar,
  closeSidebar,
  setSearchQuery,
  clearSearchQuery,
  openSearch,
  closeSearch,
} = uiSlice.actions;

export default uiSlice.reducer;
