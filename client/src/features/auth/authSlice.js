import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCurrentUserApi,
  loginUserApi,
  registerUserApi,
} from "../../api/authApi";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      return await registerUserApi(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      return await loginUserApi(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await getCurrentUserApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const token = localStorage.getItem("token");

const initialState = {
  user: null,
  token,
  isAuthenticated: Boolean(token),
  isLoading: false,
  error: null,
};

const setAuthSuccessState = (state, payload) => {
  localStorage.setItem("token", payload.token);
  state.user = payload.user;
  state.token = payload.token;
  state.isAuthenticated = true;
  state.isLoading = false;
  state.error = null;
};

const setPendingState = (state) => {
  state.isLoading = true;
  state.error = null;
};

const setRejectedState = (state, action) => {
  state.isLoading = false;
  state.error = action.payload || action.error.message || "Authentication failed";
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, setPendingState)
      .addCase(registerUser.fulfilled, (state, action) => {
        setAuthSuccessState(state, action.payload);
      })
      .addCase(registerUser.rejected, setRejectedState)
      .addCase(loginUser.pending, setPendingState)
      .addCase(loginUser.fulfilled, (state, action) => {
        setAuthSuccessState(state, action.payload);
      })
      .addCase(loginUser.rejected, setRejectedState)
      .addCase(fetchCurrentUser.pending, setPendingState)
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        setAuthSuccessState(state, action.payload);
      })
      .addCase(fetchCurrentUser.rejected, setRejectedState);
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
