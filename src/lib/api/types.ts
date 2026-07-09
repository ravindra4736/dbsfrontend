/**
 * API Response Types
 * Centralized TypeScript interfaces for backend API responses
 */

// Generic API Success Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    statusCode: number;
  };
  timestamp?: string;
}

// Validation Error Details
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// Validation Error Response
export interface ValidationErrorResponse extends ApiErrorResponse {
  error: {
    code: 'VALIDATION_ERROR';
    message: string;
    details: {
      errors: ValidationError[];
    };
    statusCode: 422;
  };
}

// Pagination Metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Paginated Response
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// Login Request
export interface LoginRequest {
  email: string;
  password: string;
}

// Login Response Data (unwrapped)
export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
  };
}

// Login Response (wrapped in ApiResponse)
export type LoginResponse = ApiResponse<LoginResponseData>;

// Refresh Token Request
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Refresh Token Response Data (unwrapped)
export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
  };
}

// Refresh Token Response (wrapped in ApiResponse)
export type RefreshTokenResponse = ApiResponse<RefreshTokenResponseData>;

// Logout Response Data (unwrapped)
export interface LogoutResponseData {
  success: boolean;
  message: string;
}

// Logout Response (wrapped in ApiResponse)
export type LogoutResponse = ApiResponse<LogoutResponseData>;

// HTTP Status Codes
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  REQUEST_TIMEOUT = 408,
}

// API Error Codes
export enum ApiErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
