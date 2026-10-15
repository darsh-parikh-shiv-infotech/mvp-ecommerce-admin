import type { ChangePasswordRequest, ChangePasswordResponse, CheckAuthStatusResponse, ForgotPasswordRequest, ForgotPasswordResponse, LoginReqest, LoginResponse } from '../store/slices/auth/AuthThunk';
import type { DeleteCategoryResponse, DeleteCategoryRequest, ListCategoryResponse, AddCategoryRequest, AddCategoryResponse, EditCategoryRequest, EditCategoryResponse, ViewSingleCategoryRequest, ViewSingleCategoryResponse, ListCategoryRequest } from '../store/slices/category/categoryThunk';
import type { changeStatusProductRequest, changeStatusProductResponse, imageUploadRequest, imageUploadResponse, listAttributeResponse, listProductRequest, listProductResponse, viewProductRequest, viewProductResponse } from '../store/slices/product/productThunk';
import axiosClient from './axios';

// Auth Api
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

// Category Api
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

// Product Api
export const listProductApi = async (reqBody: listProductRequest): Promise<listProductResponse> => {
  const response = await axiosClient.post<listProductResponse>(
    '/product/list-Of-products',
    reqBody
  );

  return response.data;
}
export const listAttributeApi = async (): Promise<listAttributeResponse> => {
  const response = await axiosClient.post<listAttributeResponse>(
    '/attribute/list-of-attribute-set',{}
  );

  return response.data;
}
export const viewProductApi = async (reqBody: viewProductRequest): Promise<viewProductResponse> => {
  const response = await axiosClient.get<viewProductResponse>(
    `/product/view-product/${reqBody.id}`
  );

  return response.data;
}
export const changeStatusProductApi = async (reqBody: changeStatusProductRequest): Promise<changeStatusProductResponse> => {
  const response = await axiosClient.put<changeStatusProductResponse>(
    `/product/update-product-status/${reqBody.id}`,
    {status:reqBody.status}
  );

  return response.data;
}


export const imageUploadApi = async (file: imageUploadRequest): Promise<imageUploadResponse> => {
  const formData = new FormData();
  formData.append('files', file);

  const response = await axiosClient.post<imageUploadResponse>(
    `/common/fileUpload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}
