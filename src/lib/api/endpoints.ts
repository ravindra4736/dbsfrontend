/**
 * API Endpoint Management
 * Centralized endpoint definitions for all API routes
 */

// Base API paths
export const API_PATHS = {
  AUTH: '/auth',
  USERS: '/users',
  ROLES: '/roles',
  PERMISSIONS: '/permissions',
  CMS: '/cms',
  MEDIA: '/media',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
} as const;

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_PATHS.AUTH}/login`,
  LOGOUT: `${API_PATHS.AUTH}/logout`,
  REFRESH: `${API_PATHS.AUTH}/refresh`,
  REGISTER: `${API_PATHS.AUTH}/register`,
  FORGOT_PASSWORD: `${API_PATHS.AUTH}/forgot-password`,
  RESET_PASSWORD: `${API_PATHS.AUTH}/reset-password`,
  VERIFY_EMAIL: `${API_PATHS.AUTH}/verify-email`,
} as const;

// User endpoints
export const USER_ENDPOINTS = {
  LIST: `${API_PATHS.USERS}`,
  CREATE: `${API_PATHS.USERS}`,
  GET: (id: string) => `${API_PATHS.USERS}/${id}`,
  UPDATE: (id: string) => `${API_PATHS.USERS}/${id}`,
  DELETE: (id: string) => `${API_PATHS.USERS}/${id}`,
  PROFILE: `${API_PATHS.USERS}/profile`,
  CHANGE_PASSWORD: `${API_PATHS.USERS}/change-password`,
} as const;

// Role endpoints
export const ROLE_ENDPOINTS = {
  LIST: `${API_PATHS.ROLES}`,
  CREATE: `${API_PATHS.ROLES}`,
  GET: (id: string) => `${API_PATHS.ROLES}/${id}`,
  UPDATE: (id: string) => `${API_PATHS.ROLES}/${id}`,
  DELETE: (id: string) => `${API_PATHS.ROLES}/${id}`,
  ASSIGN_PERMISSIONS: (id: string) => `${API_PATHS.ROLES}/${id}/permissions`,
} as const;

// Permission endpoints
export const PERMISSION_ENDPOINTS = {
  LIST: `${API_PATHS.PERMISSIONS}`,
  CREATE: `${API_PATHS.PERMISSIONS}`,
  GET: (id: string) => `${API_PATHS.PERMISSIONS}/${id}`,
  UPDATE: (id: string) => `${API_PATHS.PERMISSIONS}/${id}`,
  DELETE: (id: string) => `${API_PATHS.PERMISSIONS}/${id}`,
} as const;

// CMS endpoints
export const CMS_ENDPOINTS = {
  PAGES: `${API_PATHS.CMS}/pages`,
  PAGE: (id: string) => `${API_PATHS.CMS}/pages/${id}`,
  POSTS: `${API_PATHS.CMS}/posts`,
  POST: (id: string) => `${API_PATHS.CMS}/posts/${id}`,
  CATEGORIES: `${API_PATHS.CMS}/categories`,
  CATEGORY: (id: string) => `${API_PATHS.CMS}/categories/${id}`,
  TAGS: `${API_PATHS.CMS}/tags`,
  TAG: (id: string) => `${API_PATHS.CMS}/tags/${id}`,
} as const;

// Media endpoints
export const MEDIA_ENDPOINTS = {
  UPLOAD: `${API_PATHS.MEDIA}/upload`,
  LIST: `${API_PATHS.MEDIA}`,
  GET: (id: string) => `${API_PATHS.MEDIA}/${id}`,
  DELETE: (id: string) => `${API_PATHS.MEDIA}/${id}`,
} as const;

// Dashboard endpoints
export const DASHBOARD_ENDPOINTS = {
  STATS: `${API_PATHS.DASHBOARD}/stats`,
  ACTIVITY: `${API_PATHS.DASHBOARD}/activity`,
  CHARTS: `${API_PATHS.DASHBOARD}/charts`,
} as const;

// Settings endpoints
export const SETTINGS_ENDPOINTS = {
  GENERAL: `${API_PATHS.SETTINGS}/general`,
  SECURITY: `${API_PATHS.SETTINGS}/security`,
  NOTIFICATIONS: `${API_PATHS.SETTINGS}/notifications`,
  INTEGRATIONS: `${API_PATHS.SETTINGS}/integrations`,
} as const;

// Export all endpoints as a single object
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USERS: USER_ENDPOINTS,
  ROLES: ROLE_ENDPOINTS,
  PERMISSIONS: PERMISSION_ENDPOINTS,
  CMS: CMS_ENDPOINTS,
  MEDIA: MEDIA_ENDPOINTS,
  DASHBOARD: DASHBOARD_ENDPOINTS,
  SETTINGS: SETTINGS_ENDPOINTS,
} as const;
