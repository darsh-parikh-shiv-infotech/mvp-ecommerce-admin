import axios, { type InternalAxiosRequestConfig } from 'axios';

import { StatusCodes } from 'http-status-codes';
import { ApiError, getApplicationApiError, getApiResponseMessage } from './apiError';
import {
  API_ENDPOINTS,
  API_ERROR_CODES,
  API_ERROR_MESSAGES,
  APP_CONFIG,
  HTTP_HEADERS,
  ROUTES,
  STORAGE_KEYS,
} from '../utils/constants/constants';
import { clearStoredAuthToken } from '../utils/authStorage';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_ADMIN_BASE_URL,
  timeout: APP_CONFIG.API_TIMEOUT_MS,
  headers: {
    [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.JSON,
    [HTTP_HEADERS.ACCEPT]: HTTP_HEADERS.JSON,
  },
});

const redirectToLogin = (requestUrl?: string) => {
  if (requestUrl?.includes(API_ENDPOINTS.LOGIN)) return;

  clearStoredAuthToken();
  // Interceptors run outside React, so use browser navigation instead of React hooks.
  if (window.location.pathname !== ROUTES.LOGIN) {
    window.location.replace(ROUTES.LOGIN);
  }
};

// Request interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    if (token) {
      config.headers.set(HTTP_HEADERS.AUTHORIZATION, `Bearer ${token}`);
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    const applicationError = getApplicationApiError(response.data);
    if (applicationError) {
      if (applicationError.status === StatusCodes.UNAUTHORIZED) {
        redirectToLogin(response.config.url);
      }
      return Promise.reject(applicationError);
    }

    return response;
  },

  (error: unknown) => {
    if (axios.isAxiosError<unknown>(error)) {
      const axiosError = error;
      const status = axiosError.response?.status;
      const backendMessage = getApiResponseMessage(axiosError.response?.data);

      // Request reached the server and received an HTTP error.
      if (status) {
        if (status === StatusCodes.UNAUTHORIZED) {
          redirectToLogin(axiosError.config?.url);

          throw new ApiError(
            backendMessage || API_ERROR_MESSAGES.SESSION_EXPIRED,
            status,
            axiosError.code,
          );
        }

        if (status === StatusCodes.FORBIDDEN) {
          throw new ApiError(
            backendMessage || API_ERROR_MESSAGES.FORBIDDEN,
            status,
            axiosError.code,
          );
        }

        if (status === StatusCodes.NOT_FOUND) {
          throw new ApiError(
            backendMessage || API_ERROR_MESSAGES.NOT_FOUND,
            status,
            axiosError.code,
          );
        }

        if (status >= StatusCodes.INTERNAL_SERVER_ERROR) {
          throw new ApiError(
            backendMessage || API_ERROR_MESSAGES.SERVER_ERROR,
            status,
            axiosError.code,
          );
        }

        throw new ApiError(
          backendMessage || API_ERROR_MESSAGES.REQUEST_FAILED,
          status,
          axiosError.code,
        );
      }

      // The request was made but no response arrived.
      if (axiosError.code === API_ERROR_CODES.REQUEST_TIMEOUT) {
        throw new ApiError(API_ERROR_MESSAGES.REQUEST_TIMED_OUT);
      }

      // DNS, offline, refused connection, etc.
      if (!axiosError.response) {
        throw new ApiError(API_ERROR_MESSAGES.CONNECTION_FAILED);
      }
    }

    // Unexpected non-Axios error.
    throw error;
  },
);

export default axiosClient;
