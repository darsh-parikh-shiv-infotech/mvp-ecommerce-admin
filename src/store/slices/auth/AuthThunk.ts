import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthUser } from './authSlice';
import { ApiError, toApiErrorPayload, type ApiErrorPayload } from '../../../api/apiError';
import {
  changePasswordApi,
  checkAuthStatusApi,
  forgotPasswordApi,
  loginApi,
  type ChangePasswordRequest,
  type ForgotPasswordRequest,
  type LoginReqest,
} from '../../../api/api';

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


export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginReqest,
  { rejectValue: ApiErrorPayload }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginApi({ ...credentials, role: 'Admin' });

   
    if (response && response.data) {
      localStorage.setItem('token', response.data.token);
    } else {
      throw new ApiError(response?.message || 'Unexpected login response.');
    }

    return response;
  } catch (error: unknown) {
    return rejectWithValue(toApiErrorPayload(error, 'An unexpected error occurred.'));
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
    return rejectWithValue(toApiErrorPayload(error, 'An unexpected error occurred.'));
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
    return rejectWithValue(toApiErrorPayload(error, 'An unexpected error occurred.'));
  }
});

export const checkAuthStatus = createAsyncThunk<CheckAuthStatusResponse, void, { rejectValue: ApiErrorPayload }>(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await checkAuthStatusApi()

      return response;
    } catch (error: unknown) {
      return rejectWithValue(toApiErrorPayload(error, 'An unexpected error occurred.'));
    }
  }
);