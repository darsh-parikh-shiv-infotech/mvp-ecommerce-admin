import { createSlice } from "@reduxjs/toolkit";
import { listCategory } from "./categoryThunk";

export interface Category {
    id: number,
    name: string,
    createdAt: string,
    updatedAt: string
}
interface CategoryState {
    data: Category[],
    isLoading: boolean,
    error: string | null,
    totalItems: number,
    totalPages: number,
    currentPage: number,
    pageSize: number,
    numberOfRows: number
}
const initialState: CategoryState = {
    data: [],
    isLoading: true,
    error: null,
    totalItems: 1,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
    numberOfRows: 10
}

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => { 
        builder
        .addCase(listCategory.pending,(state)=>{
            state.data=[];
            state.isLoading=true;
            state.error=null;
            state.currentPage=0;
            state.numberOfRows=0;
            state.pageSize=0;
            state.totalItems=0;
            state.totalPages=0
        })
        .addCase(listCategory.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.data=action.payload?.data?.rows;
            state.error=null;
            state.currentPage=action.payload?.data?.currentPage;
            state.numberOfRows=action.payload?.data?.numberOfRows;
            state.pageSize=action.payload?.data?.pageSize;
            state.totalItems=action.payload?.data?.totalItems;
            state.totalPages=action.payload?.data?.totalPages
        })
         .addCase(listCategory.rejected,(state,action)=>{
            state.data=[];
            state.isLoading=false;
            state.error = action.payload?.message ?? action.error.message ?? 'Fetching Category Data Failed.';
            state.currentPage=0;
            state.numberOfRows=0;
            state.pageSize=0;
            state.totalItems=0;
            state.totalPages=0
        })
    }
})

export default categorySlice.reducer;
