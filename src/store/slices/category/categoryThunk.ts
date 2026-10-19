import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Category } from "./categorySlice";
import { toApiErrorPayload, type ApiErrorPayload } from "../../../api/apiError";
import { addCategoryApi, deleteCategoryApi, editCategoryApi, listCategoryApi, viewSingleCategoryApi } from "../../../api/api";
import { API_ERROR_MESSAGES } from "../../../utils/constants/constants";

export interface ListCategoryResponse {
    data: {
        rows: Category[] | [];
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
        numberOfRows: number
    };
    message: string
}
export interface ListCategoryRequest {
    sortValue?: "desc" | "asc" | null,
    sortKey?: string,
    page?: number,
    limit?: number,
    search?: string
}
export interface ViewSingleCategoryResponse {
    data: Category;
    message: string
}
export interface ViewSingleCategoryRequest {
    id:number
}
export interface AddCategoryResponse {
    message: string
}
export interface AddCategoryRequest {
    name:string
}
export interface EditCategoryResponse {
    message: string
}
export interface EditCategoryRequest {
    id:number;
    name:string
}
export interface DeleteCategoryResponse {
    message: string
}
export interface DeleteCategoryRequest {
    id:number
}
export const listCategory = createAsyncThunk<
    ListCategoryResponse,
    ListCategoryRequest,
    { rejectValue: ApiErrorPayload }
>("category/listCategory", async (body, { rejectWithValue }) => {
    try {
        const response = await listCategoryApi(body);

        return response;
    } catch (error: unknown) {
        return rejectWithValue(toApiErrorPayload(error, API_ERROR_MESSAGES.UNEXPECTED));
    }
})
export const viewSingleCategory = createAsyncThunk<
    ViewSingleCategoryResponse,
    ViewSingleCategoryRequest,
    { rejectValue: ApiErrorPayload }
>("category/viewSingleCategory", async (body, { rejectWithValue }) => {
    try {
        const response = await viewSingleCategoryApi(body);

        return response;
    } catch (error: unknown) {
        return rejectWithValue(toApiErrorPayload(error, API_ERROR_MESSAGES.UNEXPECTED));
    }
})
export const addCategory = createAsyncThunk<
    AddCategoryResponse,
    AddCategoryRequest,
    { rejectValue: ApiErrorPayload }
>("category/addCategory", async (body, { rejectWithValue }) => {
    try {
        const response = await addCategoryApi(body);

        return response;
    } catch (error: unknown) {
        return rejectWithValue(toApiErrorPayload(error, API_ERROR_MESSAGES.UNEXPECTED));
    }
})
export const editCategory = createAsyncThunk<
    EditCategoryResponse,
    EditCategoryRequest,
    { rejectValue: ApiErrorPayload }
>("category/editCategory", async (body, { rejectWithValue }) => {
    try {
        const response = await editCategoryApi(body);

        return response;
    } catch (error: unknown) {
        return rejectWithValue(toApiErrorPayload(error, API_ERROR_MESSAGES.UNEXPECTED));
    }
})
export const deleteCategory = createAsyncThunk<
    DeleteCategoryResponse,
    DeleteCategoryRequest,
    { rejectValue: ApiErrorPayload }
>("category/deleteCategory", async (param, { rejectWithValue }) => {
    try {
        const response = await deleteCategoryApi(param);

        return response;
    } catch (error: unknown) {
        return rejectWithValue(toApiErrorPayload(error, API_ERROR_MESSAGES.UNEXPECTED));
    }
})
