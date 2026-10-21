import { createSlice } from '@reduxjs/toolkit';
import {
  addProduct,
  changeStatusProduct,
  deleteVariant,
  imageUpload,
  listAttribute,
  listProduct,
  updateProduct,
  viewProduct,
} from './productThunk';
import {
  APP_CONFIG,
  PRODUCT_STATUSES,
  PRODUCT_STATE_ERROR_MESSAGES,
} from '../../../utils/constants/constants';
import { RequestStatus, type RequestState } from '../common';

export interface attribute {
  id: number;
  name: string;
}
export interface variant {
  id: number;
  title: string;
  product_variant_image?: string[];
  code: string;
  fake_price: number;
  price: number;
  available_quantity: number;
  on_hand_quantity: number;
  status?: (typeof PRODUCT_STATUSES)[keyof typeof PRODUCT_STATUSES];
}
export type EditableVariant = Partial<variant> & { clientId: string };
export interface product {
  id: number;
  title: string;
  description: string;
  variants: variant[] | null;
  status: (typeof PRODUCT_STATUSES)[keyof typeof PRODUCT_STATUSES];
  createdAt: string;
  product_image: string;
  meta_title?: string;
  meta_key?: string;
  meta_description?: string;
  min_price: number;
  max_price: number;
  attribute_set?: attribute;
}
interface productState {
  data: product[];
  selectedProduct: product | null;
  attributeSetData: attribute[];

  requests: {
    fetchAll: RequestState;
    fetchSingle: RequestState;
    fetchAllAttributes: RequestState;
    create: RequestState;
    update: RequestState;
    changeStatus: RequestState;
    deleteVariant: RequestState;
    imageUpload: RequestState;
  };

  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  numberOfRows: number;
}
const initialState: productState = {
  data: [],
  selectedProduct: null,
  attributeSetData: [],
  requests: {
    fetchAll: { status: RequestStatus.IDLE, error: null },
    fetchSingle: { status: RequestStatus.IDLE, error: null },
    fetchAllAttributes: { status: RequestStatus.IDLE, error: null },
    create: { status: RequestStatus.IDLE, error: null },
    update: { status: RequestStatus.IDLE, error: null },
    changeStatus: { status: RequestStatus.IDLE, error: null },
    deleteVariant: { status: RequestStatus.IDLE, error: null },
    imageUpload: { status: RequestStatus.IDLE, error: null },
  },
  totalItems: APP_CONFIG.INITIAL_TOTAL_ITEMS,
  totalPages: APP_CONFIG.INITIAL_TOTAL_PAGES,
  currentPage: APP_CONFIG.FIRST_PAGE,
  pageSize: APP_CONFIG.INITIAL_PAGE_SIZE,
  numberOfRows: APP_CONFIG.INITIAL_PAGE_SIZE,
};
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listProduct.pending, (state) => {
        state.data = [];
        state.requests.fetchAll.status = RequestStatus.LOADING;
        state.requests.fetchAll.error = null;
        state.currentPage = 0;
        state.numberOfRows = 0;
        state.pageSize = 0;
        state.totalItems = 0;
        state.totalPages = 0;
      })
      .addCase(listProduct.fulfilled, (state, action) => {
        state.data = action.payload?.data?.rows || [];
        state.requests.fetchAll.status = RequestStatus.SUCCEEDED;
        state.currentPage = action.payload?.data?.currentPage;
        state.numberOfRows = action.payload?.data?.numberOfRows;
        state.pageSize = action.payload?.data?.pageSize;
        state.totalItems = action.payload?.data?.totalItems;
        state.totalPages = action.payload?.data?.totalPages;
      })
      .addCase(listProduct.rejected, (state, action) => {
        state.data = [];
        state.requests.fetchAll.status = RequestStatus.FAILED;
        state.requests.fetchAll.error =
          action.payload?.message ??
          action.error.message ??
          PRODUCT_STATE_ERROR_MESSAGES.FETCH_FAILED;
        state.currentPage = 0;
        state.numberOfRows = 0;
        state.pageSize = 0;
        state.totalItems = 0;
        state.totalPages = 0;
      })

      .addCase(listAttribute.pending, (state) => {
        state.requests.fetchAllAttributes.status = RequestStatus.LOADING;
        state.requests.fetchAllAttributes.error = null;
      })
      .addCase(listAttribute.fulfilled, (state, action) => {
        state.requests.fetchAllAttributes.status = RequestStatus.SUCCEEDED;
        state.attributeSetData = action.payload?.data?.rows || [];
      })
      .addCase(listAttribute.rejected, (state, action) => {
        state.requests.fetchAllAttributes.status = RequestStatus.FAILED;
        state.attributeSetData = [];
        state.requests.fetchAllAttributes.error =
          action.payload?.message ??
          action.error.message ??
          PRODUCT_STATE_ERROR_MESSAGES.FETCH_ATTRIBUTES_FAILED;
      })

      .addCase(viewProduct.pending, (state) => {
        state.requests.fetchSingle.status = RequestStatus.LOADING;
        state.selectedProduct = null;
        state.requests.fetchSingle.error = null;
      })
      .addCase(viewProduct.fulfilled, (state, action) => {
        state.requests.fetchSingle.status = RequestStatus.SUCCEEDED;
        state.selectedProduct = action.payload?.data || null;
      })
      .addCase(viewProduct.rejected, (state, action) => {
        state.requests.fetchSingle.status = RequestStatus.FAILED;
        state.selectedProduct = null;
        state.requests.fetchSingle.error =
          action.payload?.message ??
          action.error.message ??
          PRODUCT_STATE_ERROR_MESSAGES.FETCH_SINGLE_FAILED;
      })

      .addCase(changeStatusProduct.pending, (state) => {
        state.requests.changeStatus.status = RequestStatus.LOADING;
        state.requests.changeStatus.error = null;
      })
      .addCase(changeStatusProduct.fulfilled, (state) => {
        state.requests.changeStatus.status = RequestStatus.SUCCEEDED;
      })
      .addCase(changeStatusProduct.rejected, (state, action) => {
        state.requests.changeStatus.status = RequestStatus.FAILED;
        state.requests.changeStatus.error =
          action.payload?.message ??
          action.error.message ??
          PRODUCT_STATE_ERROR_MESSAGES.CHANGE_STATUS_FAILED;
      })

      .addCase(imageUpload.pending, (state) => {
        state.requests.imageUpload.status = RequestStatus.LOADING;
        state.requests.imageUpload.error = null;
      })
      .addCase(imageUpload.fulfilled, (state) => {
        state.requests.imageUpload.status = RequestStatus.SUCCEEDED;
      })
      .addCase(imageUpload.rejected, (state, action) => {
        state.requests.imageUpload.status = RequestStatus.FAILED;
        state.requests.imageUpload.error =
          action.payload?.message ??
          action.error.message ??
          PRODUCT_STATE_ERROR_MESSAGES.UPLOAD_FAILED;
      })

      .addCase(addProduct.pending, (state) => {
        state.requests.create.status = RequestStatus.LOADING;
        state.requests.create.error = null;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.requests.create.status = RequestStatus.SUCCEEDED;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.requests.create.status = RequestStatus.FAILED;
        state.requests.create.error =
          action.payload?.message ??
          action.error.message ??
          PRODUCT_STATE_ERROR_MESSAGES.ADD_FAILED;
      })
      .addCase(updateProduct.pending, (state) => {
        state.requests.update.status = RequestStatus.LOADING;
        state.requests.update.error = null;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.requests.update.status = RequestStatus.SUCCEEDED;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.requests.update.status = RequestStatus.FAILED;
        state.requests.update.error =
          action.payload?.message ??
          action.error.message ??
          PRODUCT_STATE_ERROR_MESSAGES.UPDATE_FAILED;
      })
      .addCase(deleteVariant.pending, (state) => {
        state.requests.deleteVariant.status = RequestStatus.LOADING;
        state.requests.deleteVariant.error = null;
      })
      .addCase(deleteVariant.fulfilled, (state) => {
        state.requests.deleteVariant.status = RequestStatus.SUCCEEDED;
      })
      .addCase(deleteVariant.rejected, (state, action) => {
        state.requests.deleteVariant.status = RequestStatus.FAILED;
        state.requests.deleteVariant.error =
          action.payload?.message ??
          action.error.message ??
          PRODUCT_STATE_ERROR_MESSAGES.DELETE_FAILED;
      });
  },
});

export default productSlice.reducer;
