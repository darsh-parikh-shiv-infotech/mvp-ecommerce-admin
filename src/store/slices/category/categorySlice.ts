import { createSlice } from '@reduxjs/toolkit';
import {
  addCategory,
  deleteCategory,
  editCategory,
  listCategory,
  viewSingleCategory,
} from './categoryThunk';
import { APP_CONFIG, CATEGORY_STATE_ERROR_MESSAGES } from '../../../utils/constants/constants';
import { RequestStatus, type RequestState } from '../common';

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryState {
  data: Category[];
  selectedCategory: Category | null;

  requests: {
    fetchAll: RequestState;
    fetchSingle: RequestState;
    create: RequestState;
    update: RequestState;
    delete: RequestState;
  };

  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  numberOfRows: number;
}
const initialState: CategoryState = {
  data: [],
  selectedCategory: null,
  requests: {
    fetchAll: { status: RequestStatus.IDLE, error: null },
    fetchSingle: { status: RequestStatus.IDLE, error: null },
    create: { status: RequestStatus.IDLE, error: null },
    update: { status: RequestStatus.IDLE, error: null },
    delete: { status: RequestStatus.IDLE, error: null },
  },
  totalItems: APP_CONFIG.INITIAL_TOTAL_ITEMS,
  totalPages: APP_CONFIG.INITIAL_TOTAL_PAGES,
  currentPage: APP_CONFIG.FIRST_PAGE,
  pageSize: APP_CONFIG.INITIAL_PAGE_SIZE,
  numberOfRows: APP_CONFIG.INITIAL_PAGE_SIZE,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listCategory.pending, (state) => {
        state.data = [];
        state.requests.fetchAll.status = RequestStatus.LOADING;
        state.requests.fetchAll.error = null;
        state.currentPage = 0;
        state.numberOfRows = 0;
        state.pageSize = 0;
        state.totalItems = 0;
        state.totalPages = 0;
      })
      .addCase(listCategory.fulfilled, (state, action) => {
        state.data = action.payload?.data?.rows || [];
        state.requests.fetchAll.status = RequestStatus.SUCCEEDED;
        state.currentPage = action.payload?.data?.currentPage;
        state.numberOfRows = action.payload?.data?.numberOfRows;
        state.pageSize = action.payload?.data?.pageSize;
        state.totalItems = action.payload?.data?.totalItems;
        state.totalPages = action.payload?.data?.totalPages;
      })
      .addCase(listCategory.rejected, (state, action) => {
        state.data = [];
        state.requests.fetchAll.status = RequestStatus.FAILED;
        state.requests.fetchAll.error =
          action.payload?.message ??
          action.error.message ??
          CATEGORY_STATE_ERROR_MESSAGES.FETCH_FAILED;
        state.currentPage = 0;
        state.numberOfRows = 0;
        state.pageSize = 0;
        state.totalItems = 0;
        state.totalPages = 0;
      })
      .addCase(viewSingleCategory.pending, (state) => {
        state.requests.fetchSingle.status = RequestStatus.LOADING;
        state.requests.fetchSingle.error = null;
        state.selectedCategory = null;
      })
      .addCase(viewSingleCategory.fulfilled, (state, action) => {
        state.requests.fetchSingle.status = RequestStatus.SUCCEEDED;
        state.selectedCategory = action.payload.data;
      })
      .addCase(viewSingleCategory.rejected, (state, action) => {
        state.requests.fetchSingle.status = RequestStatus.FAILED;
        state.requests.fetchSingle.error =
          action.payload?.message ??
          action.error.message ??
          CATEGORY_STATE_ERROR_MESSAGES.SELECT_FAILED;
      })
      .addCase(addCategory.pending, (state) => {
        state.requests.create.status = RequestStatus.LOADING;
        state.requests.create.error = null;
      })
      .addCase(addCategory.fulfilled, (state) => {
        state.requests.create.status = RequestStatus.SUCCEEDED;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.requests.create.status = RequestStatus.FAILED;
        state.requests.create.error =
          action.payload?.message ??
          action.error.message ??
          CATEGORY_STATE_ERROR_MESSAGES.ADD_FAILED;
      })
      .addCase(editCategory.pending, (state) => {
        state.requests.update.status = RequestStatus.LOADING;
        state.requests.update.error = null;
      })
      .addCase(editCategory.fulfilled, (state) => {
        state.requests.update.status = RequestStatus.SUCCEEDED;
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.requests.update.status = RequestStatus.FAILED;
        state.requests.update.error =
          action.payload?.message ??
          action.error.message ??
          CATEGORY_STATE_ERROR_MESSAGES.EDIT_FAILED;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.requests.delete.status = RequestStatus.LOADING;
        state.requests.delete.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.requests.delete.status = RequestStatus.SUCCEEDED;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.requests.delete.status = RequestStatus.FAILED;
        state.requests.delete.error =
          action.payload?.message ??
          action.error.message ??
          CATEGORY_STATE_ERROR_MESSAGES.DELETE_FAILED;
      });
  },
});

export default categorySlice.reducer;
