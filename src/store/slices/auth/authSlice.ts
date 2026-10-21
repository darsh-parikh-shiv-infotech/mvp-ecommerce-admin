import { createSlice } from '@reduxjs/toolkit';
import { changePassword, checkAuthStatus, forgotPassword, loginUser } from './AuthThunk';
import { AUTH_STATE_ERROR_MESSAGES } from '../../../utils/constants/constants';
import { RequestStatus, type RequestState } from '../common';

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
  requests: {
    login: RequestState;
    forgotPassword: RequestState;
    changePassword: RequestState;
  };
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing: true,
  requests: {
    login: { status: RequestStatus.IDLE, error: null },
    forgotPassword: { status: RequestStatus.IDLE, error: null },
    changePassword: { status: RequestStatus.IDLE, error: null },
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser(state, action) {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.requests.login.status = RequestStatus.LOADING;
        state.requests.login.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.requests.login.status = RequestStatus.SUCCEEDED;

        state.user = action.payload.data?.user || null;
        state.token = action.payload.data?.token;
        state.isAuthenticated = true;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.requests.login.status = RequestStatus.FAILED;

        state.requests.login.error =
          action.payload?.message ?? action.error.message ?? AUTH_STATE_ERROR_MESSAGES.LOGIN_FAILED;

        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.requests.forgotPassword.status = RequestStatus.LOADING;
        state.requests.forgotPassword.error = null;
      })

      .addCase(forgotPassword.fulfilled, (state) => {
        state.requests.forgotPassword.status = RequestStatus.SUCCEEDED;
      })

      .addCase(forgotPassword.rejected, (state, action) => {
        state.requests.forgotPassword.status = RequestStatus.FAILED;

        state.requests.forgotPassword.error =
          action.payload?.message ??
          action.error.message ??
          AUTH_STATE_ERROR_MESSAGES.FORGOT_PASSWORD_FAILED;
      })

      .addCase(changePassword.pending, (state) => {
        state.requests.changePassword.status = RequestStatus.LOADING;
        state.requests.changePassword.error = null;
      })

      .addCase(changePassword.fulfilled, (state) => {
        state.requests.changePassword.status = RequestStatus.SUCCEEDED;
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.requests.changePassword.status = RequestStatus.FAILED;

        state.requests.changePassword.error =
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

export const { updateUser, logout } = authSlice.actions;

export default authSlice.reducer;
