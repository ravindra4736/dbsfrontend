/**
 * API Layer - Backward Compatibility Wrapper
 * Re-exports the new API layer for existing code
 * 
 * @deprecated Import from @/lib/api instead
 */

// Re-export everything from the new API layer
export {
  apiClient as api,
  createApiClient,
  request,
  setupInterceptors,
  setupRequestInterceptor,
  setupResponseInterceptor,
  setAuthTokens,
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  isAuthenticated,
  handleApiError,
  getErrorMessage,
  isUnauthorizedError,
  isValidationError,
  isNetworkError,
  isTimeoutError,
  ApiError,
  HttpStatusCode,
  ApiErrorCode,
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
  type ApiResponse,
  type ApiErrorResponse,
  type ValidationError,
  type ValidationErrorResponse,
  type PaginationMeta,
  type PaginatedResponse,
  type LoginRequest,
  type LoginResponse,
  type RefreshTokenRequest,
  type RefreshTokenResponse,
  type LogoutResponse,
  type TokenStorage,
} from '@/lib/api';

// Default export for backward compatibility
export { default } from '@/lib/api';
