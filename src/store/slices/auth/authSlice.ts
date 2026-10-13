import { createSlice } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  profile_image: string;
}

export interface LoginResponse {
  data: {
    user: AuthUser | null;
    token: string;
  };
  message: string;
}
export interface ForgotPasswordResponse {
  message: string;  
  statusCode: number;
}
export interface ChangePasswordResponse {
  message: string;
  statusCode: number;
}
export interface CheckAuthStatusResponse {
   data: AuthUser;
  message: string;
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
  extraReducers: (builder) => {}
});

export const { clearAuthError, updateUser, logout } = authSlice.actions;

export default authSlice.reducer;
