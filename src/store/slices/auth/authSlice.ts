import { createSlice } from '@reduxjs/toolkit';
import { changePassword, checkAuthStatus, forgotPassword, loginUser } from './AuthThunk';

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  profile_image: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing:true,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data?.user || null;
        state.token = action.payload.data?.token;
        state.isAuthenticated = true;
        state.error = null;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload?.message ?? action.error.message ?? 'Login failed.';

        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload?.message ?? action.error.message ?? 'Forgot Password failed.';
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload?.message ?? action.error.message ?? 'Change Password failed.';
      })

      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload?.data || null;
        state.isAuthenticated = true;
        state.isInitializing = false;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitializing = false;
      });
  },
});

export const { clearAuthError, updateUser, logout } = authSlice.actions;

export default authSlice.reducer;
