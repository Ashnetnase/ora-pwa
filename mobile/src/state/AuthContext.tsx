import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the user type
interface User {
  email: string;
}

// Define the auth context state
interface AuthState {
  user: User | null;
  loading: boolean;
}

// Define the auth context methods
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  // Check for existing session on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const sessionData = await AsyncStorage.getItem('alartd_session');
      if (sessionData) {
        const user = JSON.parse(sessionData);
        setState({ user, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
      setState({ user: null, loading: false });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // TODO: Add actual authentication logic here
      // For now, just store the email (mock authentication)
      const user = { email };
      await AsyncStorage.setItem('alartd_session', JSON.stringify(user));
      setState({ user, loading: false });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('alartd_session');
      setState({ user: null, loading: false });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
