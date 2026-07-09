/**
 * API Layer Main Entry Point
 * Exports all API utilities, types, and configured client
 */

// Re-export client
export { apiClient, createApiClient, request } from './client';

// Re-export interceptors
export {
  setupInterceptors,
  setupRequestInterceptor,
  setupResponseInterceptor,
} from './interceptors';

// Re-export types
export type {
  ApiResponse,
  ApiErrorResponse,
  ValidationError,
  ValidationErrorResponse,
  PaginationMeta,
  PaginatedResponse,
  LoginRequest,
  LoginResponse,
  LoginResponseData,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RefreshTokenResponseData,
  LogoutResponse,
  LogoutResponseData,
} from './types';

export { HttpStatusCode, ApiErrorCode } from './types';

// Re-export errors
export {
  ApiError,
  handleApiError,
  getErrorMessage,
  isUnauthorizedError,
  isValidationError,
  isNetworkError,
  isTimeoutError,
} from './errors';

// Re-export auth utilities
export {
  setTokenStorage,
  getTokenStorage,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
  isAuthenticated,
  parseJwt,
  isTokenExpired,
  getTokenExpirationTime,
  type TokenStorage,
} from './auth';

// Re-export endpoints
export {
  API_PATHS,
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  ROLE_ENDPOINTS,
  PERMISSION_ENDPOINTS,
  CMS_ENDPOINTS,
  MEDIA_ENDPOINTS,
  DASHBOARD_ENDPOINTS,
  SETTINGS_ENDPOINTS,
  API_ENDPOINTS,
} from './endpoints';

// Create and configure the default API client
import { apiClient } from './client';
import { setupInterceptors } from './interceptors';

// Setup interceptors on the default client
setupInterceptors(apiClient);

// Export the configured client as default
export default apiClient;
