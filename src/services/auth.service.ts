/**
 * Authentication Service
 * Handles authentication operations using the API layer
 */

import api, {
  API_ENDPOINTS,
  type LoginRequest,
  type LoginResponse,
  type LogoutResponse,
  setAuthTokens,
  clearAuthTokens,
  getAccessToken,
  isTokenExpired,
  handleApiError,
} from '@/lib/api';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class AuthService {
  private currentUser: User | null = null;

  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<User> {
    try {
      const response = await api.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
      );

      const { data } = response.data;
      const { accessToken, refreshToken, user } = data;

      // Store tokens in localStorage
      setAuthTokens(accessToken, refreshToken);

      // Store tokens in cookies for middleware
      if (typeof document !== 'undefined') {
        const isSecure = process.env.NODE_ENV === 'production';
        document.cookie = `accessToken=${accessToken}; path=/; max-age=2592000; SameSite=Strict${isSecure ? '; Secure' : ''}`;
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=2592000; SameSite=Strict${isSecure ? '; Secure' : ''}`;
      }

      // Store user data
      this.currentUser = user;

      return user;
    } catch (error) {
      const apiError = handleApiError(error as Parameters<typeof handleApiError>[0]);
      throw apiError;
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      const accessToken = getAccessToken();
      if (accessToken) {
        await api.post<LogoutResponse>(API_ENDPOINTS.AUTH.LOGOUT);
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear tokens and user data
      clearAuthTokens();
      this.currentUser = null;

      // Clear cookies
      if (typeof document !== 'undefined') {
        const isSecure = process.env.NODE_ENV === 'production';
        document.cookie = `accessToken=; path=/; max-age=0; SameSite=Strict${isSecure ? '; Secure' : ''}`;
        document.cookie = `refreshToken=; path=/; max-age=0; SameSite=Strict${isSecure ? '; Secure' : ''}`;
      }
    }
  }

  /**
   * Get current user from stored data
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Set current user (used for session restoration)
   */
  setCurrentUser(user: User | null): void {
    this.currentUser = user;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const accessToken = getAccessToken();
    if (!accessToken) return false;

    // Check if token is expired
    if (isTokenExpired(accessToken)) {
      clearAuthTokens();
      this.currentUser = null;
      return false;
    }

    return true;
  }

  /**
   * Restore session from stored token
   * Returns user data if token is valid, null otherwise
   */
  async restoreSession(): Promise<User | null> {
    const accessToken = getAccessToken();
    if (!accessToken) return null;

    if (isTokenExpired(accessToken)) {
      clearAuthTokens();
      this.currentUser = null;

      // Clear cookies
      if (typeof document !== 'undefined') {
        const isSecure = process.env.NODE_ENV === 'production';
        document.cookie = `accessToken=; path=/; max-age=0; SameSite=Strict${isSecure ? '; Secure' : ''}`;
        document.cookie = `refreshToken=; path=/; max-age=0; SameSite=Strict${isSecure ? '; Secure' : ''}`;
      }

      return null;
    }

    // Parse user data from JWT token
    try {
      const payload = this.parseJwt(accessToken);
      if (payload && payload.sub && payload.email && payload.roles) {
        const user: User = {
          id: String(payload.sub),
          email: String(payload.email),
          roles: Array.isArray(payload.roles) ? payload.roles as string[] : [],
        };
        this.currentUser = user;
        return user;
      }
    } catch (error) {
      console.error('Failed to parse JWT:', error);
      clearAuthTokens();
      this.currentUser = null;
    }

    return null;
  }

  /**
   * Parse JWT token (client-side only)
   */
  private parseJwt(token: string): Record<string, unknown> | null {
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
  }
}

// Export singleton instance
export const authService = new AuthService();
