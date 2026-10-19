import { createAsyncThunk } from "@reduxjs/toolkit";
import type { attribute, product } from "./productSlice";
import { toApiErrorPayload, type ApiErrorPayload } from "../../../api/apiError";
import { changeStatusProductApi, imageUploadApi, listAttributeApi, listProductApi, viewProductApi } from "../../../api/api";
import { API_ERROR_MESSAGES, PRODUCT_STATUSES } from "../../../utils/constants/constants";

export interface listProductRequest {
    sortValue?: "desc" | "asc" | null,
    sortKey?: string,
    page?: number,
    limit?: number,
    search?: string
}
export interface listProductResponse {
    data: {
        rows: product[] | [];
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
        numberOfRows: number
    };
    message: string
}
export interface listAttributeResponse {
    data: { rows: attribute[] | [] };
    message: string
}
export interface viewProductRequest {
    id: number
}
export interface viewProductResponse {
    data: product | null;
    message: string
}
export interface changeStatusProductRequest {
    id: number,
    status: (typeof PRODUCT_STATUSES)[keyof typeof PRODUCT_STATUSES]
}
export interface changeStatusProductResponse {
    message: string
}
export type imageUploadRequest = File

export interface imageUploadResponse {
    data: {
        image: { fileName: string, url: string }[]
    };
    message: string
}

export const listProduct = createAsyncThunk<
    listProductResponse,
    listProductRequest,
    { rejectValue: ApiErrorPayload }
>("product/listProduct", async (body, { rejectWithValue }) => {
    try {
        const response = await listProductApi(body);
        return response;
    } catch (error: unknown) {
        return rejectWithValue(toApiErrorPayload(error, API_ERROR_MESSAGES.UNEXPECTED))
    }
})
export const listAttribute = createAsyncThunk<
    listAttributeResponse,
    void,
    { rejectValue: ApiErrorPayload }
>("product/listAttribute", async (_, { rejectWithValue }) => {
    try {
        const response = await listAttributeApi();
        return response;
    } catch (error: unknown) {
        return rejectWithValue(toApiErrorPayload(error, API_ERROR_MESSAGES.UNEXPECTED))
    }
})
export const viewProduct = createAsyncThunk<
    viewProductResponse,
    viewProductRequest,
    { rejectValue: ApiErrorPayload }
>("product/viewProduct", async (body, { rejectWithValue }) => {
    try {
        const response = await viewProductApi(body);
        return response;
    } catch (error: unknown) {
        return rejectWithValue(toApiErrorPayload(error, API_ERROR_MESSAGES.UNEXPECTED))
    }
})
export const changeStatusProduct = createAsyncThunk<
    changeStatusProductResponse,
    changeStatusProductRequest,
    { rejectValue: ApiErrorPayload }
>("product/changeStatusProduct", async (body, { rejectWithValue }) => {
    try {
        const response = await changeStatusProductApi(body);
        return response;
    } catch (error: unknown) {
        return rejectWithValue(toApiErrorPayload(error, API_ERROR_MESSAGES.UNEXPECTED))
    }
})
export const imageUpload = createAsyncThunk<
    imageUploadResponse,
    imageUploadRequest,
    { rejectValue: ApiErrorPayload }
>("common/imageUpload", async (body, { rejectWithValue }) => {
    try {
        const response = await imageUploadApi(body);
        return response
    } catch (error: unknown) {
        return rejectWithValue(toApiErrorPayload(error, API_ERROR_MESSAGES.UNEXPECTED))
    }
})