export const selectAuthUser = (state) => state.auth.user;

export const selectAuthToken = (state) => state.auth.token;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectAuthLoading = (state) => state.auth.isLoading;

export const selectAuthError = (state) => state.auth.error;
