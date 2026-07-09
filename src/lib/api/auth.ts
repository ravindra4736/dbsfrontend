/**
 * Authentication Utilities
 * Token management with replaceable storage strategy
 */

// Token storage interface for flexibility
export interface TokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setAccessToken(token: string): void;
  setRefreshToken(token: string): void;
  clearTokens(): void;
}

// Default localStorage implementation
class LocalStorageTokenStorage implements TokenStorage {
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem('refreshToken');
  }

  setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('accessToken', token);
  }

  setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('refreshToken', token);
  }

  clearTokens(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
  }
}

// Current storage implementation (can be replaced)
let tokenStorage: TokenStorage = new LocalStorageTokenStorage();

// Set custom token storage (for testing or alternative strategies)
export const setTokenStorage = (storage: TokenStorage): void => {
  tokenStorage = storage;
};

// Get current token storage
export const getTokenStorage = (): TokenStorage => {
  return tokenStorage;
};

// Token management functions
export const getAccessToken = (): string | null => {
  return tokenStorage.getAccessToken();
};

export const getRefreshToken = (): string | null => {
  return tokenStorage.getRefreshToken();
};

export const setAuthTokens = (
  accessToken: string,
  refreshToken?: string,
): void => {
  tokenStorage.setAccessToken(accessToken);
  if (refreshToken) {
    tokenStorage.setRefreshToken(refreshToken);
  }
};

export const clearAuthTokens = (): void => {
  tokenStorage.clearTokens();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

// Parse JWT token (basic implementation)
export const parseJwt = (token: string): Record<string, unknown> | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  const expirationTime = (payload.exp as number) * 1000;
  return Date.now() >= expirationTime;
};

// Get token expiration time
export const getTokenExpirationTime = (token: string): number | null => {
  const payload = parseJwt(token);
  return payload?.exp ? (payload.exp as number) * 1000 : null;
};
