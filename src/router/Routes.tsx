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
import { ROUTES } from '../utils/constants/constants';
import ProductEditPage from '../pages/products/ProductEditPage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.HOME} element={<MainLayout />}>
          <Route index element={<Navigate to={ROUTES.PRODUCT} />} />
          <Route path={ROUTES.CATEGORY} element={<CategoryHomePage />} />
          <Route path={ROUTES.CATEGORY_ADD} element={<CategoryAddPage />} />
          <Route path={ROUTES.CATEGORY_EDIT_PATTERN} element={<CategoryEditPage />} />

          <Route path={ROUTES.PRODUCT} element={<ProductHome />} />
          <Route path={ROUTES.PRODUCT_VIEW_PATTERN} element={<ViewProductPage />} />
          <Route path={ROUTES.PRODUCT_ADD} element={<AddProductPage />} />
          <Route path={ROUTES.PRODUCT_EDIT_PATTERN} element={<ProductEditPage />} />

        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);
