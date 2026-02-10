/**
 * Authentication Context and Better Auth Integration
 *
 * Provides authentication state management and methods
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './types';
import { authAPI, setSessionToken, clearSessionToken, APIError } from './api';

/**
 * Authentication state interface
 */
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Authentication context value interface
 */
interface AuthContextValue extends AuthState {
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

/**
 * Create authentication context
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Authentication Provider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 *
 * Wraps the application and provides authentication state and methods
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  /**
   * Initialize authentication state from session storage
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        // Check if user data exists in session storage
        const userDataStr = sessionStorage.getItem('auth_user');

        // Handle invalid or undefined data
        if (!userDataStr || userDataStr === 'undefined' || userDataStr === 'null') {
          setState({
            user: null,
            loading: false,
            error: null,
          });
          return;
        }

        const userData = JSON.parse(userDataStr);

        // Validate that userData has required fields
        if (userData && userData.id && userData.email) {
          setState({
            user: userData,
            loading: false,
            error: null,
          });
        } else {
          // Invalid user data, clear it
          sessionStorage.removeItem('auth_user');
          setState({
            user: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Clear invalid data
        sessionStorage.removeItem('auth_user');
        setState({
          user: null,
          loading: false,
          error: null,
        });
      }
    };

    initAuth();
  }, []);

  /**
   * Login method
   */
  const login = async (usernameOrEmail: string, password: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authAPI.login({ username_or_email: usernameOrEmail, password });

      // Create user object from response
      const user: User = {
        id: response.user_id,
        username: response.username,
        email: response.email,
      };

      // Store token and user data
      setSessionToken(response.access_token);
      sessionStorage.setItem('auth_user', JSON.stringify(user));

      setState({
        user: user,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof APIError
        ? error.message
        : 'Login failed. Please try again.';

      setState({
        user: null,
        loading: false,
        error: errorMessage,
      });

      throw error;
    }
  };

  /**
   * Signup method
   */
  const signup = async (username: string, email: string, password: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authAPI.signup({ username, email, password });

      // Create user object from response
      const user: User = {
        id: response.user_id,
        username: response.username,
        email: response.email,
      };

      // Store token and user data
      setSessionToken(response.access_token);
      sessionStorage.setItem('auth_user', JSON.stringify(user));

      setState({
        user: user,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof APIError
        ? error.message
        : 'Signup failed. Please try again.';

      setState({
        user: null,
        loading: false,
        error: errorMessage,
      });

      throw error;
    }
  };

  /**
   * Logout method
   */
  const logout = (): void => {
    // Clear token and user data
    clearSessionToken();
    sessionStorage.removeItem('auth_user');

    setState({
      user: null,
      loading: false,
      error: null,
    });
  };

  /**
   * Clear error method
   */
  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextValue = {
    ...state,
    login,
    signup,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 *
 * Custom hook to access authentication context
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * Check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { user } = useAuth();
  return user !== null;
}
