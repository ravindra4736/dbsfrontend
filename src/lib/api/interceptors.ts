/**
 * API Interceptors
 * Request and response interceptors with refresh token rotation support
 */

import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_ENDPOINTS } from './endpoints';
import { clearAuthTokens, getAccessToken, getRefreshToken, setAuthTokens } from './auth';
import { handleApiError } from './errors';

// Refresh token state
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Add subscriber to queue
const subscribeTokenRefresh = (callback: (token: string) => void): void => {
  refreshSubscribers.push(callback);
};

// Notify subscribers of new token
const onTokenRefreshed = (token: string): void => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Clear subscribers on refresh failure
const onTokenRefreshFailed = (): void => {
  refreshSubscribers = [];
};

// Setup request interceptor
export const setupRequestInterceptor = (client: AxiosInstance): void => {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = getAccessToken();
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );
};

// Setup response interceptor with refresh token support
export const setupResponseInterceptor = (client: AxiosInstance): void => {
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // If error is not 401 or already retried, reject immediately
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(handleApiError(error));
      }

      // Mark request as retried
      originalRequest._retry = true;

      // If already refreshing, queue the request
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(client(originalRequest));
          });
        }).catch((err) => {
          return Promise.reject(handleApiError(err));
        });
      }

      // Start refresh process
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          // No refresh token available, clear auth and reject
          clearAuthTokens();
          onTokenRefreshFailed();
          return Promise.reject(handleApiError(error));
        }

        // Attempt to refresh token
        const response = await client.post(API_ENDPOINTS.AUTH.REFRESH, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Store new tokens in localStorage
        setAuthTokens(accessToken, newRefreshToken);

        // Update cookies for middleware
        if (typeof document !== 'undefined') {
          const isSecure = process.env.NODE_ENV === 'production';
          document.cookie = `accessToken=${accessToken}; path=/; max-age=2592000; SameSite=Strict${isSecure ? '; Secure' : ''}`;
          document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=2592000; SameSite=Strict${isSecure ? '; Secure' : ''}`;
        }

        // Update original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Notify subscribers
        onTokenRefreshed(accessToken);

        // Retry original request
        return client(originalRequest);
      } catch {
        // Refresh failed, clear tokens and reject
        clearAuthTokens();
        onTokenRefreshFailed();
        return Promise.reject(handleApiError(error));
      } finally {
        isRefreshing = false;
      }
    },
  );
};

// Setup all interceptors
export const setupInterceptors = (client: AxiosInstance): void => {
  setupRequestInterceptor(client);
  setupResponseInterceptor(client);
};
