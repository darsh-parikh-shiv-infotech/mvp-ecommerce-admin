import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/auth/authSlice"
import categoryReducer from "./slices/category/categorySlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
