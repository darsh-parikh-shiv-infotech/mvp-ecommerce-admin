import { createSlice } from '@reduxjs/toolkit';
import { changePassword, checkAuthStatus, forgotPassword, loginUser } from './AuthThunk';
import { AUTH_STATE_ERROR_MESSAGES, STORAGE_KEYS } from '../../../utils/constants/constants';

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
  isInitializing: true,
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
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      state.user = null;
      state.isAuthenticated = false;
    },
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

        state.error =
          action.payload?.message ?? action.error.message ?? AUTH_STATE_ERROR_MESSAGES.LOGIN_FAILED;

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

        state.error =
          action.payload?.message ??
          action.error.message ??
          AUTH_STATE_ERROR_MESSAGES.FORGOT_PASSWORD_FAILED;
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

        state.error =
          action.payload?.message ??
          action.error.message ??
          AUTH_STATE_ERROR_MESSAGES.CHANGE_PASSWORD_FAILED;
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
