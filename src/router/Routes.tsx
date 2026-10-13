import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import LoginPage from '../pages/auth/LoginPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);
