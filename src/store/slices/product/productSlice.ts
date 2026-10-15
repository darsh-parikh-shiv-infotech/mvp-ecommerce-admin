import { createSlice } from "@reduxjs/toolkit";
import { changeStatusProduct, listProduct, viewProduct } from "./productThunk";

export interface attributeSet {
    id: number,
    name: string
}
export interface variant{
    id:number,
    title:string,
    product_variant_image: string[],
    code:string,
    price:number,
    available_quantity:number,
    status:string
}
export interface product {
    id: number,
    title: string,
    description:string,
    variants:variant[]|null,
    status: "active"|"inactive",
    createdAt: string,
    product_image: string,
    min_price: number,
    max_price: number,
    attribute_set: attributeSet
}
interface productState {
    data: product[],
    selectedProduct: product | null,
    isLoading: boolean,
    error: string | null,
    totalItems: number,
    totalPages: number,
    currentPage: number,
    pageSize: number,
    numberOfRows: number
}
const initialState: productState = {
    data: [],
    selectedProduct: null,
    isLoading: true,
    error: null,
    totalItems: 1,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
    numberOfRows: 10
}
const productSlice = createSlice({
    name: "product",
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
                state.totalPages = 0
            })
            .addCase(listProduct.fulfilled, (state, action) => {
                state.data = action.payload?.data?.rows || []
                state.isLoading = false;
                state.error = null;
                state.currentPage = action.payload?.data?.currentPage;
                state.numberOfRows = action.payload?.data?.numberOfRows;
                state.pageSize = action.payload?.data?.pageSize;
                state.totalItems = action.payload?.data?.totalItems;
                state.totalPages = action.payload?.data?.totalPages
            })
            .addCase(listProduct.rejected, (state, action) => {
                state.data = []
                state.isLoading = false;
                state.error = action.payload?.message ?? action.error.message ?? 'Fetching Product Data Failed.';
                state.currentPage = 0;
                state.numberOfRows = 0;
                state.pageSize = 0;
                state.totalItems = 0;
                state.totalPages = 0
            })

            .addCase(viewProduct.pending, (state) => {
                state.isLoading = true
                state.selectedProduct = null
                state.error = null
            })
            .addCase(viewProduct.fulfilled, (state,action) => {
                state.isLoading = false
                state.selectedProduct = action.payload?.data || null
                state.error = null
            })
            .addCase(viewProduct.rejected, (state,action) => {
                state.isLoading = false
                state.selectedProduct = null
                state.error = action.payload?.message ?? action.error.message ?? 'Fetching Single Product Data Failed.';
            })

            .addCase(changeStatusProduct.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(changeStatusProduct.fulfilled, (state) => {
                state.isLoading = false
                state.error = null
            })
            .addCase(changeStatusProduct.rejected, (state,action) => {
                state.isLoading = false
                state.error = action.payload?.message ?? action.error.message ?? 'Fetching Single Product Data Failed.';
            })
    }
})

export default productSlice.reducer;