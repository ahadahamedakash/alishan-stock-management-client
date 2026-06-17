import { createSlice } from "@reduxjs/toolkit";

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      const { token, ...user } = action.payload;

      state.user = user;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

// Export actions and reducer
export const { clearError, setUser, logout } = authSlice.actions;

export default authSlice.reducer;

// USER TOKEN
export const useCurrentToken = (state) => state.auth.token;

// USER INFO
export const useCurrentUser = (state) => state.auth.user;
