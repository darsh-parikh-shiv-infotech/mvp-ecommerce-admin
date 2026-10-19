import { createSlice } from "@reduxjs/toolkit";
import { addCategory, deleteCategory, editCategory, listCategory, viewSingleCategory } from "./categoryThunk";
import { APP_CONFIG, CATEGORY_STATE_ERROR_MESSAGES } from "../../../utils/constants/constants";

export interface Category {
    id: number,
    name: string,
    createdAt: string,
    updatedAt: string
}
interface CategoryState {
    data: Category[],
    selectedCategory:Category|null;
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
    selectedCategory:null,
    isLoading: true,
    error: null,
    totalItems: APP_CONFIG.INITIAL_TOTAL_ITEMS,
    totalPages: APP_CONFIG.INITIAL_TOTAL_PAGES,
    currentPage: APP_CONFIG.FIRST_PAGE,
    pageSize: APP_CONFIG.INITIAL_PAGE_SIZE,
    numberOfRows: APP_CONFIG.INITIAL_PAGE_SIZE
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
            state.data=action.payload?.data?.rows||[];
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
            state.error = action.payload?.message ?? action.error.message ?? CATEGORY_STATE_ERROR_MESSAGES.FETCH_FAILED;
            state.currentPage=0;
            state.numberOfRows=0;
            state.pageSize=0;
            state.totalItems=0;
            state.totalPages=0
        })
        .addCase(viewSingleCategory.pending,(state)=>{
            state.isLoading=true
            state.selectedCategory=null
        })
        .addCase(viewSingleCategory.fulfilled,(state,action)=>{
            state.isLoading=false
            state.selectedCategory=action.payload.data
        })
        .addCase(viewSingleCategory.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload?.message ?? action.error.message ?? CATEGORY_STATE_ERROR_MESSAGES.SELECT_FAILED;
        })
        .addCase(addCategory.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(addCategory.fulfilled,(state)=>{
            state.isLoading=false
        })
        .addCase(addCategory.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload?.message ?? action.error.message ?? CATEGORY_STATE_ERROR_MESSAGES.ADD_FAILED;
        })
        .addCase(editCategory.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(editCategory.fulfilled,(state)=>{
            state.isLoading=false
        })
        .addCase(editCategory.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload?.message ?? action.error.message ?? CATEGORY_STATE_ERROR_MESSAGES.EDIT_FAILED;
        })
        .addCase(deleteCategory.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(deleteCategory.fulfilled,(state)=>{
            state.isLoading=false
        })
        .addCase(deleteCategory.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload?.message ?? action.error.message ?? CATEGORY_STATE_ERROR_MESSAGES.DELETE_FAILED;
        })
    }
})

export default categorySlice.reducer;
