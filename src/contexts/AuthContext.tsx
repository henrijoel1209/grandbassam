import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, Role } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  refreshSession: () => Promise<void>;
  isAuthenticated: boolean;
  lastActivity: Date;
}

const TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development
const mockUser: User = {
  id: '1',
  email: 'admin@grandbassam.ci',
  username: 'admin',
  role: 'admin' as Role,
  fullName: 'Administrateur',
  department: 'Administration',
  lastLogin: new Date(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null,
    refreshToken: null,
    lastActivity: new Date(),
  });

  // Vérifier l'inactivité
  useEffect(() => {
    const checkInactivity = () => {
      const now = new Date();
      if (state.lastActivity && now.getTime() - state.lastActivity.getTime() > INACTIVITY_TIMEOUT) {
        logout();
      }
    };

    const interval = setInterval(checkInactivity, 60000); // Vérifier chaque minute
    return () => clearInterval(interval);
  }, [state.lastActivity]);

  // Rafraîchir le token automatiquement
  useEffect(() => {
    const refreshTokenInterval = setInterval(async () => {
      if (state.refreshToken) {
        try {
          await refreshSession();
        } catch (error) {
          console.error('Failed to refresh token:', error);
          logout();
        }
      }
    }, TOKEN_EXPIRY - 60000); // Rafraîchir 1 minute avant l'expiration

    return () => clearInterval(refreshTokenInterval);
  }, [state.refreshToken]);

  const login = async (user: User, token: string, refreshToken: string) => {
    // Stocker les tokens dans des cookies httpOnly via l'API
    await fetch('/api/auth/cookies', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, refreshToken }),
    });

    setState({
      user,
      isAuthenticated: true,
      token,
      refreshToken,
      lastActivity: new Date(),
    });
  };

  const logout = async () => {
    // Supprimer les cookies via l'API
    await fetch('/api/auth/cookies', {
      method: 'DELETE',
      credentials: 'include',
    });

    setState({
      user: null,
      isAuthenticated: false,
      token: null,
      refreshToken: null,
      lastActivity: null,
    });
  };

  const refreshSession = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: state.refreshToken }),
      });

      if (!response.ok) throw new Error('Failed to refresh session');

      const { token, refreshToken } = await response.json();
      setState(prev => ({
        ...prev,
        token,
        refreshToken,
        lastActivity: new Date(),
      }));
    } catch (error) {
      console.error('Error refreshing session:', error);
      logout();
    }
  };

  const value = {
    ...state,
    login,
    logout,
    refreshSession,
    isAuthenticated: state.isAuthenticated,
    lastActivity: state.lastActivity,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
