import type { ChangePasswordResponse, CheckAuthStatusResponse, ForgotPasswordResponse, LoginResponse } from '../store/slices/auth/AuthThunk';
import type { DeleteCategoryResponse, DeleteCategoryRequest, ListCategoryResponse, AddCategoryRequest, AddCategoryResponse, EditCategoryRequest, EditCategoryResponse, ViewSingleCategoryRequest, ViewSingleCategoryResponse, ListCategoryRequest } from '../store/slices/category/categoryThunk';
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

export const listCategoryApi = async (reqBody: ListCategoryRequest,): Promise<ListCategoryResponse> => {
  const response = await axiosClient.post<ListCategoryResponse>(
    '/attribute/list-Of-attributes',
    reqBody
  );

  return response.data;
}
export const viewSingleCategoryApi = async (reqBody: ViewSingleCategoryRequest,): Promise<ViewSingleCategoryResponse> => {
  const response = await axiosClient.get<ViewSingleCategoryResponse>(
    `/attribute/view-attribute/${reqBody.id}`,
  );

  return response.data;
}
export const addCategoryApi = async (body: AddCategoryRequest): Promise<AddCategoryResponse> => {
  const response = await axiosClient.post<AddCategoryResponse>(
    `/attribute/add-attribute`,
    body
  );

  return response.data;
}
export const editCategoryApi = async (body: EditCategoryRequest): Promise<EditCategoryResponse> => {
  const id = body.id
  const updateBody = { name: body.name }
  const response = await axiosClient.put<EditCategoryResponse>(
    `/attribute/update-attribute/${id}`,
    updateBody
  );

  return response.data;
}
export const deleteCategoryApi = async (param: DeleteCategoryRequest): Promise<DeleteCategoryResponse> => {
  const response = await axiosClient.delete<DeleteCategoryResponse>(
    `/attribute/delete-attribute/${param.id}`
  );

  return response.data;
}