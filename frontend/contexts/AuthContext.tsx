import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../app/features/auth/services/AuthService';
import { User } from '../app/features/auth/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Verificar autenticación al inicio
  useEffect(() => {
    checkAuth();
  }, []);

  // Protección de rutas
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === '(auth)' || segments[0] === 'index';

    if (!isAuthenticated && !inAuthGroup && segments[0] !== undefined) {
      // Usuario no autenticado intenta acceder a rutas protegidas
      router.replace('/login');
    } else if (isAuthenticated && segments[0] === 'login') {
      // Usuario autenticado intenta acceder específicamente al login
      router.replace('/home');
    }
  }, [isAuthenticated, segments, isLoading]);

  const checkAuth = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const userData = await authService.getUserData();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ username: email, password });
      
      if (response.success && response.data && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        // Redirección explícita después del login
        setTimeout(() => {
          router.replace('/home');
        }, 100);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
