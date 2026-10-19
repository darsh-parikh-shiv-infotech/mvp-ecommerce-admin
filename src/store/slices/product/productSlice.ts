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
  isLoading: boolean;
  error: string | null;
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
  isLoading: true,
  error: null,
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
        state.isLoading = true;
        state.error = null;
        state.currentPage = 0;
        state.numberOfRows = 0;
        state.pageSize = 0;
        state.totalItems = 0;
        state.totalPages = 0;
      })
      .addCase(listProduct.fulfilled, (state, action) => {
        state.data = action.payload?.data?.rows || [];
        state.isLoading = false;
        state.error = null;
        state.currentPage = action.payload?.data?.currentPage;
        state.numberOfRows = action.payload?.data?.numberOfRows;
        state.pageSize = action.payload?.data?.pageSize;
        state.totalItems = action.payload?.data?.totalItems;
        state.totalPages = action.payload?.data?.totalPages;
      })
      .addCase(listProduct.rejected, (state, action) => {
        state.data = [];
        state.isLoading = false;
        state.error =
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
        state.error = null;
      })
      .addCase(listAttribute.fulfilled, (state, action) => {
        state.attributeSetData = action.payload?.data?.rows || [];
      })
      .addCase(listAttribute.rejected, (state, action) => {
        state.error =
          action.payload?.message ??
          action.error.message ??
          PRODUCT_STATE_ERROR_MESSAGES.FETCH_ATTRIBUTES_FAILED;
      })

      .addCase(viewProduct.pending, (state) => {
        state.isLoading = true;
        state.selectedProduct = null;
        state.error = null;
      })
      .addCase(viewProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload?.data || null;
        state.error = null;
      })
      .addCase(viewProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = null;
        state.error =
          action.payload?.message ??
          action.error.message ??
          PRODUCT_STATE_ERROR_MESSAGES.FETCH_SINGLE_FAILED;
      })

      .addCase(changeStatusProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeStatusProduct.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changeStatusProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ??
          action.error.message ??
          PRODUCT_STATE_ERROR_MESSAGES.FETCH_SINGLE_FAILED;
      })

      .addCase(imageUpload.pending, (state) => {
        state.error = null;
      })
      .addCase(imageUpload.rejected, (state, action) => {
        state.error =
          action.payload?.message ??
          action.error.message ??
          PRODUCT_STATE_ERROR_MESSAGES.UPLOAD_FAILED;
      })

      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ??
          action.error.message ??
          PRODUCT_STATE_ERROR_MESSAGES.UPLOAD_FAILED;
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ??
          action.error.message ??
          PRODUCT_STATE_ERROR_MESSAGES.UPLOAD_FAILED;
      })
      .addCase(deleteVariant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteVariant.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteVariant.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ??
          action.error.message ??
          PRODUCT_STATE_ERROR_MESSAGES.UPLOAD_FAILED;
      });
  },
});

export default productSlice.reducer;
