import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from '../utils/constants/constants';
import {
  AddProductPage,
  CategoryAddPage,
  CategoryEditPage,
  CategoryHomePage,
  LoginPage,
  MainLayout,
  NotFoundPage,
  ProductEditPage,
  ProductHome,
  ResetPasswordPage,
  ProductSingleViewPage,
} from './RoutePages';

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
          <Route path={ROUTES.PRODUCT_VIEW_PATTERN} element={<ProductSingleViewPage />} />
          <Route path={ROUTES.PRODUCT_ADD} element={<AddProductPage />} />
          <Route path={ROUTES.PRODUCT_EDIT_PATTERN} element={<ProductEditPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);
