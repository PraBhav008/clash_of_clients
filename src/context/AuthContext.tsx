import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiVerifySession, apiChangeCredentials } from '../utils/cloudflareD1';

export interface AuthUser {
  email: string;
  role: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateCredentials: (currentPassword: string, newEmail: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('coc_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('coc_auth_token');
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!token;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Verify existing token on mount
  useEffect(() => {
    const verifyExistingSession = async () => {
      const savedToken = localStorage.getItem('coc_auth_token');
      if (!savedToken) {
        setIsLoading(false);
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await apiVerifySession(savedToken);
        if (res.success && res.user) {
          setUser(res.user);
          setIsAuthenticated(true);
          localStorage.setItem('coc_auth_user', JSON.stringify(res.user));
        } else {
          // Token expired or invalid
          console.warn('[AUTH] Saved session invalid or expired. Prompting re-login.');
          localStorage.removeItem('coc_auth_token');
          localStorage.removeItem('coc_auth_user');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (e) {
        // If network is completely offline, allow session to persist if token exists
        console.warn('[AUTH] Offline or verify check deferred:', e);
        if (savedToken) {
          setIsAuthenticated(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyExistingSession();
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setIsLoading(true);

    try {
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();

      const res = await apiLogin(cleanEmail, cleanPassword);

      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        setIsAuthenticated(true);

        if (rememberMe) {
          localStorage.setItem('coc_auth_token', res.token);
          localStorage.setItem('coc_auth_user', JSON.stringify(res.user));
        } else {
          sessionStorage.setItem('coc_auth_token', res.token);
          sessionStorage.setItem('coc_auth_user', JSON.stringify(res.user));
        }

        setIsLoading(false);
        return { success: true };
      } else {
        const errMsg = res.error || 'Invalid admin email or password.';
        setAuthError(errMsg);
        setIsLoading(false);
        return { success: false, error: errMsg };
      }
    } catch (err: any) {
      const errMsg = err.message || 'Authentication error. Check edge connection.';
      setAuthError(errMsg);
      setIsLoading(false);
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('coc_auth_token');
    localStorage.removeItem('coc_auth_user');
    sessionStorage.removeItem('coc_auth_token');
    sessionStorage.removeItem('coc_auth_user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  const updateCredentials = async (
    currentPassword: string,
    newEmail: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await apiChangeCredentials(currentPassword, newEmail, newPassword);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('coc_auth_token', res.token);
        localStorage.setItem('coc_auth_user', JSON.stringify(res.user));
        return { success: true };
      }
      return { success: false, error: res.error || 'Failed to update credentials' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error updating credentials' };
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        authError,
        login,
        logout,
        updateCredentials,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
