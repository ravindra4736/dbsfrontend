import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

import { env } from "@/config/env";

const api: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const accessToken = window.localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== "undefined") {
        const refreshToken = window.localStorage.getItem("refreshToken");
        if (refreshToken) {
          // Foundation only: refresh handling is prepared but not implemented.
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  },
);

export const setAuthTokens = (accessToken: string, refreshToken?: string) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      window.localStorage.setItem("refreshToken", refreshToken);
    }
  }
};

export const clearAuthTokens = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
  }
};

export default api;
