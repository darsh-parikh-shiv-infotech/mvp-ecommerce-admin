import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthUser } from './authSlice';
import { ApiError, toApiErrorPayload, type ApiErrorPayload } from '../../../api/apiError';
import {
  changePasswordApi,
  checkAuthStatusApi,
  forgotPasswordApi,
  loginApi,
} from '../../../api/api';
import {
  API_ERROR_MESSAGES,
  AUTH_ROLES,
  STORAGE_KEYS,
} from '../../../utils/constants/constants';

export interface LoginReqest {
  email: string;
  password: string;
  role?: typeof AUTH_ROLES.ADMIN;
}
export interface LoginResponse {
  data: {
    user: AuthUser | null;
    token: string;
  };
  message: string;
}
export interface ForgotPasswordRequest {
  email: string;
}
export interface ForgotPasswordResponse {
  message: string;  
  statusCode: number;
}
export interface ChangePasswordRequest {
  email: string;
  otp: number;
  newPassword: string;
  confirmPassword: string;
}
export interface ChangePasswordResponse {
  message: string;
  statusCode: number;
}
export interface CheckAuthStatusResponse {
  data: AuthUser;
  message: string;
}


export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginReqest,
  { rejectValue: ApiErrorPayload }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginApi({ ...credentials, role: AUTH_ROLES.ADMIN });

   
    if (response && response.data) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    } else {
      throw new ApiError(response?.message || API_ERROR_MESSAGES.UNEXPECTED_LOGIN_RESPONSE);
    }

    return response;
  } catch (error: unknown) {
    return rejectWithValue(toApiErrorPayload(error, API_ERROR_MESSAGES.UNEXPECTED));
  }
});

export const forgotPassword = createAsyncThunk<
  ForgotPasswordResponse,
  ForgotPasswordRequest,
  { rejectValue: ApiErrorPayload }
>('auth/forgotPassword', async (body, { rejectWithValue }) => {
  try {
    const response = await forgotPasswordApi(body);

    return response;
  } catch (error: unknown) {
    return rejectWithValue(toApiErrorPayload(error, API_ERROR_MESSAGES.UNEXPECTED));
  }
});

export const changePassword = createAsyncThunk<
  ChangePasswordResponse,
  ChangePasswordRequest,
  { rejectValue: ApiErrorPayload }
>('auth/changePassword', async (body, { rejectWithValue }) => {
  try {
    const response = await changePasswordApi(body);

    return response;
  } catch (error: unknown) {
    return rejectWithValue(toApiErrorPayload(error, API_ERROR_MESSAGES.UNEXPECTED));
  }
});

export const checkAuthStatus = createAsyncThunk<CheckAuthStatusResponse, void, { rejectValue: ApiErrorPayload }>(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) throw new Error(API_ERROR_MESSAGES.NO_TOKEN);

      const response = await checkAuthStatusApi()

      return response;
    } catch (error: unknown) {
      return rejectWithValue(toApiErrorPayload(error, API_ERROR_MESSAGES.UNEXPECTED));
    }
  }
);