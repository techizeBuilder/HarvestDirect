import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      console.log('Attempting login with:', { email, password: '***' });
      
      const data = await apiRequest('POST', '/api/auth/login', {
        email, 
        password
      });
      
      console.log('Login response:', data);
      
      if (data && data.token) {
        // Save auth data to localStorage
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        
        // Update state
        setToken(data.token);
        setUser(data.user);
        
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });

      return true;
    } catch (error) {
      let message = 'Login failed';
      if (error instanceof Error) {
        message = error.message;
      }
      
      toast({
        title: 'Login failed',
        description: message,
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      toast({
        title: 'Registration successful',
        description: 'Please check your email to verify your account.',
      });

      return true;
    } catch (error) {
      let message = 'Registration failed';
      if (error instanceof Error) {
        message = error.message;
      }
      
      toast({
        title: 'Registration failed',
        description: message,
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  const updateProfile = async (name: string): Promise<boolean> => {
    if (!token) return false;
    
    try {
      setIsLoading(true);
      const response = await apiRequest('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({ name }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setUser(data.user);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });

      return true;
    } catch (error) {
      let message = 'Failed to update profile';
      if (error instanceof Error) {
        message = error.message;
      }
      
      toast({
        title: 'Update failed',
        description: message,
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}