/**
 * Axios Client Configuration
 * Shared Axios instance with base configuration
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

// Create shared Axios instance
export const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: env.apiUrl,
    timeout: 10000, // 10 seconds
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return client;
};

// Default client instance
export const apiClient = createApiClient();

// Type-safe request method
export const request = async <T = unknown>(
  config: AxiosRequestConfig,
): Promise<T> => {
  const response = await apiClient.request<T>(config);
  return response.data;
};
