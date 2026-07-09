/**
 * Authentication Provider
 * Manages authentication state across the application
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, type User } from '@/services/auth.service';
import type { LoginRequest } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const restoredUser = await authService.restoreSession();
        setUser(restoredUser);
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    const loggedInUser = await authService.login(credentials);
    setUser(loggedInUser);
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    const currentUser = await authService.restoreSession();
    setUser(currentUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
