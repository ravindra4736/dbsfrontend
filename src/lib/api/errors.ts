/**
 * API Error Handling Utilities
 * Converts backend errors into frontend-friendly errors
 */

import type { AxiosError } from 'axios';
import {
  ApiErrorCode,
  HttpStatusCode,
  type ValidationErrorResponse,
} from './types';

// Custom API Error Class
export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode: HttpStatusCode;
  public readonly details?: Record<string, unknown>;
  public readonly validationErrors?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    code: ApiErrorCode,
    statusCode: HttpStatusCode,
    details?: Record<string, unknown>,
    validationErrors?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.validationErrors = validationErrors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Convert Axios error to ApiError
export const handleApiError = (error: AxiosError): ApiError => {
  if (!error.response) {
    // Network error or timeout
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return new ApiError(
        'Request timeout. Please try again.',
        ApiErrorCode.TIMEOUT_ERROR,
        HttpStatusCode.REQUEST_TIMEOUT,
      );
    }
    return new ApiError(
      'Network error. Please check your connection.',
      ApiErrorCode.NETWORK_ERROR,
      HttpStatusCode.SERVICE_UNAVAILABLE,
    );
  }

  const { status, data } = error.response;

  switch (status) {
    case HttpStatusCode.UNAUTHORIZED:
      return new ApiError(
        'Authentication required. Please log in.',
        ApiErrorCode.UNAUTHORIZED,
        HttpStatusCode.UNAUTHORIZED,
      );

    case HttpStatusCode.FORBIDDEN:
      return new ApiError(
        'You do not have permission to perform this action.',
        ApiErrorCode.FORBIDDEN,
        HttpStatusCode.FORBIDDEN,
      );

    case HttpStatusCode.NOT_FOUND:
      return new ApiError(
        'The requested resource was not found.',
        ApiErrorCode.NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );

    case HttpStatusCode.UNPROCESSABLE_ENTITY:
      const validationData = data as ValidationErrorResponse;
      const validationErrors = validationData.error.details?.errors.map(
        (err) => ({
          field: err.field,
          message: err.message,
        }),
      );
      return new ApiError(
        validationData.error.message || 'Validation failed.',
        ApiErrorCode.VALIDATION_ERROR,
        HttpStatusCode.UNPROCESSABLE_ENTITY,
        validationData.error.details,
        validationErrors,
      );

    case HttpStatusCode.TOO_MANY_REQUESTS:
      return new ApiError(
        'Too many requests. Please wait and try again.',
        ApiErrorCode.TOO_MANY_REQUESTS,
        HttpStatusCode.TOO_MANY_REQUESTS,
      );

    case HttpStatusCode.INTERNAL_SERVER_ERROR:
    default:
      return new ApiError(
        'An unexpected error occurred. Please try again.',
        ApiErrorCode.INTERNAL_ERROR,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
  }
};

// Extract error message for UI display
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred.';
};

// Check if error is a specific type
export const isUnauthorizedError = (error: unknown): error is ApiError => {
  return error instanceof ApiError && error.code === ApiErrorCode.UNAUTHORIZED;
};

export const isValidationError = (error: unknown): error is ApiError => {
  return error instanceof ApiError && error.code === ApiErrorCode.VALIDATION_ERROR;
};

export const isNetworkError = (error: unknown): error is ApiError => {
  return error instanceof ApiError && error.code === ApiErrorCode.NETWORK_ERROR;
};

export const isTimeoutError = (error: unknown): error is ApiError => {
  return error instanceof ApiError && error.code === ApiErrorCode.TIMEOUT_ERROR;
};
