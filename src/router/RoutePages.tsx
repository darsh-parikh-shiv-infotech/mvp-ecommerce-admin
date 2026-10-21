import { lazy } from 'react';

export const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
export const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
export const MainLayout = lazy(() => import('../layouts/MainLayout'));
export const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
export const ProductHome = lazy(() => import('../pages/products/ProductHome'));
export const CategoryHomePage = lazy(() => import('../pages/category/CategoryHomePage'));
export const CategoryAddPage = lazy(() => import('../pages/category/CategoryAddPage'));
export const CategoryEditPage = lazy(() => import('../pages/category/CategoryEditPage'));
export const ProductSingleViewPage = lazy(() => import('../pages/products/ProductSingleViewPage'));
export const AddProductPage = lazy(() => import('../pages/products/ProductAddPage'));
export const ProductEditPage = lazy(() => import('../pages/products/ProductEditPage'));
