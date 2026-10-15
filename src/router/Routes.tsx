import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';

import LoginPage from '../pages/auth/LoginPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import NotFoundPage from '../pages/NotFoundPage';
import ProductHome from '../pages/products/ProductHome';
import CategoryHomePage from '../pages/category/CategoryHomePage';
import CategoryAddPage from '../pages/category/CategoryAddPage';
import CategoryEditPage from '../pages/category/CategoryEditPage';
import ViewProductPage from '../pages/products/ViewProductPage';
import AddProductPage from '../pages/products/AddProductPage';
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to={"/product"}/>} />
          <Route path={"category"} element={<CategoryHomePage />} />
          <Route path={"category/add"} element={<CategoryAddPage />} />
          <Route path={"category/edit/:id"} element={<CategoryEditPage />} />

          <Route path={"product"} element={<ProductHome />} />
          <Route path={"product/view/:id"} element={<ViewProductPage />} />
          <Route path={"product/add"} element={<AddProductPage />} />

        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);
