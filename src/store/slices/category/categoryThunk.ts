import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Category } from "./categorySlice";
import { toApiErrorPayload, type ApiErrorPayload } from "../../../api/apiError";
import { listCategoryApi } from "../../../api/api";

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
export interface ListCategoyRequest {
    sortValue?: "desc" | "asc" | null,
    sortKey?: string,
    page?: number,
    limit?: number,
    search?: string
}

export const listCategory = createAsyncThunk<
    ListCategoryResponse,
    ListCategoyRequest,
    { rejectValue: ApiErrorPayload }
>("category/listCategory", async (body, { rejectWithValue }) => {
    try {
        const response = await listCategoryApi(body);

        return response;
    } catch (error: unknown) {
        return rejectWithValue(toApiErrorPayload(error, 'An unexpected error occurred.'));
    }
})
