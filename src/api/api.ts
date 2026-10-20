import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  CheckAuthStatusResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginReqest,
  LoginResponse,
} from '../store/slices/auth/AuthThunk';
import type {
  DeleteCategoryResponse,
  DeleteCategoryRequest,
  ListCategoryResponse,
  AddCategoryRequest,
  AddCategoryResponse,
  EditCategoryRequest,
  EditCategoryResponse,
  ViewSingleCategoryRequest,
  ViewSingleCategoryResponse,
  ListCategoryRequest,
} from '../store/slices/category/categoryThunk';
import type {
  changeStatusProductRequest,
  changeStatusProductResponse,
  deleteVariantRequest,
  deleteVariantResponse,
  imageUploadRequest,
  imageUploadResponse,
  listAttributeResponse,
  listProductRequest,
  listProductResponse,
  productFormRequest,
  productFormResponse,
  updateProductFormRequest,
  viewProductRequest,
  viewProductResponse,
} from '../store/slices/product/productThunk';
import axiosClient from './axios';
import { API_ENDPOINTS, FORM_DATA_KEYS, HTTP_HEADERS } from '../utils/constants/constants';

// Auth Api
export const loginApi = async (credentials: LoginReqest): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials);

  return response.data;
};
export const forgotPasswordApi = async (
  reqBody: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> => {
  const response = await axiosClient.post<ForgotPasswordResponse>(
    API_ENDPOINTS.VERIFY_EMAIL,
    reqBody,
  );

  return response.data;
};
export const changePasswordApi = async (
  reqBody: ChangePasswordRequest,
): Promise<ChangePasswordResponse> => {
  const response = await axiosClient.post<ChangePasswordResponse>(
    API_ENDPOINTS.FORGOT_PASSWORD,
    reqBody,
  );

  return response.data;
};
export const checkAuthStatusApi = async (): Promise<CheckAuthStatusResponse> => {
  const response = await axiosClient.get<CheckAuthStatusResponse>(API_ENDPOINTS.VIEW_PROFILE);

  return response.data;
};

// Category Api
export const listCategoryApi = async (
  reqBody: ListCategoryRequest,
): Promise<ListCategoryResponse> => {
  const response = await axiosClient.post<ListCategoryResponse>(
    API_ENDPOINTS.LIST_CATEGORIES,
    reqBody,
  );

  return response.data;
};
export const viewSingleCategoryApi = async (
  reqBody: ViewSingleCategoryRequest,
): Promise<ViewSingleCategoryResponse> => {
  const response = await axiosClient.get<ViewSingleCategoryResponse>(
    API_ENDPOINTS.VIEW_CATEGORY(reqBody.id),
  );

  return response.data;
};
export const addCategoryApi = async (body: AddCategoryRequest): Promise<AddCategoryResponse> => {
  const response = await axiosClient.post<AddCategoryResponse>(API_ENDPOINTS.ADD_CATEGORY, body);

  return response.data;
};
export const editCategoryApi = async (body: EditCategoryRequest): Promise<EditCategoryResponse> => {
  const id = body.id;
  const updateBody = { name: body.name };
  const response = await axiosClient.put<EditCategoryResponse>(
    API_ENDPOINTS.UPDATE_CATEGORY(id),
    updateBody,
  );

  return response.data;
};
export const deleteCategoryApi = async (
  param: DeleteCategoryRequest,
): Promise<DeleteCategoryResponse> => {
  const response = await axiosClient.delete<DeleteCategoryResponse>(
    API_ENDPOINTS.DELETE_CATEGORY(param.id),
  );

  return response.data;
};

// Product Api
export const listProductApi = async (reqBody: listProductRequest): Promise<listProductResponse> => {
  const response = await axiosClient.post<listProductResponse>(
    API_ENDPOINTS.LIST_PRODUCTS,
    reqBody,
  );

  return response.data;
};
export const listAttributeApi = async (): Promise<listAttributeResponse> => {
  const response = await axiosClient.post<listAttributeResponse>(API_ENDPOINTS.LIST_ATTRIBUTES, {});

  return response.data;
};
export const viewProductApi = async (reqBody: viewProductRequest): Promise<viewProductResponse> => {
  const response = await axiosClient.get<viewProductResponse>(
    API_ENDPOINTS.VIEW_PRODUCT(reqBody.id),
  );

  return response.data;
};
export const changeStatusProductApi = async (
  reqBody: changeStatusProductRequest,
): Promise<changeStatusProductResponse> => {
  const response = await axiosClient.put<changeStatusProductResponse>(
    API_ENDPOINTS.UPDATE_PRODUCT_STATUS(reqBody.id),
    { status: reqBody.status },
  );

  return response.data;
};
export const imageUploadApi = async (file: imageUploadRequest): Promise<imageUploadResponse> => {
  const formData = new FormData();
  formData.append(FORM_DATA_KEYS.FILES, file);

  const response = await axiosClient.post<imageUploadResponse>(
    API_ENDPOINTS.UPLOAD_FILE,
    formData,
    {
      headers: {
        [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.MULTIPART_FORM_DATA,
      },
    },
  );
  return response.data;
};
export const addProductApi = async (body: productFormRequest): Promise<productFormResponse> => {
  const response = await axiosClient.post<productFormResponse>(API_ENDPOINTS.ADD_PRODUCT, body);

  return response.data;
};
export const updateProductApi = async (
  body: updateProductFormRequest,
): Promise<productFormResponse> => {
  const { id, ...editBody } = body;
  const response = await axiosClient.put<productFormResponse>(
    API_ENDPOINTS.UPDATE_PRODUCT(id),
    editBody,
  );

  return response.data;
};

export const deleteVariantApi = async (
  body: deleteVariantRequest,
): Promise<deleteVariantResponse> => {
  const response = await axiosClient.delete<deleteVariantResponse>(
    API_ENDPOINTS.DELETE_VARIANT(body.product_id, body.variant_id),
  );

  return response.data;
};
