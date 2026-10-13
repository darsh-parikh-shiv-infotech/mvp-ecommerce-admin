import type {
  ChangePasswordResponse,
  CheckAuthStatusResponse,
  ForgotPasswordResponse,
  LoginResponse,
} from '../Slices/Auth/AuthSlice';
import axiosClient from './axios';

export interface LoginReqest {
  email: string;
  password: string;
  role?: 'Admin';
}
export interface ForgotPasswordRequest {
  email: string;
}
export interface ChangePasswordRequest {
  email: string;
  otp: number;
  newPassword: string;
  confirmPassword: string;
}
export const loginApi = async (credentials: LoginReqest): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>('/auth-user/login', credentials);

  return response.data;
};

export const forgotPasswordApi = async (
  reqBody: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> => {
  const response = await axiosClient.post<ForgotPasswordResponse>(
    '/auth-user/verifyEmail',
    reqBody,
  );

  return response.data;
};

export const changePasswordApi = async (
  reqBody: ChangePasswordRequest,
): Promise<ChangePasswordResponse> => {
  const response = await axiosClient.post<ChangePasswordResponse>(
    '/auth-user/forgotPassword',
    reqBody,
  );

  return response.data;
};


export const checkAuthStatusApi = async (): Promise<CheckAuthStatusResponse> => {
  const response = await axiosClient.get<CheckAuthStatusResponse>(
    '/auth-user/viewProfile'
  );

  return response.data;
};
