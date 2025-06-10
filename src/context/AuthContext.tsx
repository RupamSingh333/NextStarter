'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DecimalValue {
  $numberDecimal: string;
}

interface User {
  _id: string;
  phone: string;
  customer: boolean;
  fore_closure: DecimalValue;
  settlement: DecimalValue;
  minimum_part_payment: DecimalValue;
  foreclosure_reward: DecimalValue;
  settlement_reward: DecimalValue;
  minimum_part_payment_reward: DecimalValue;
  payment_type: number;
  isPaid: boolean;
  payment_url: string;
  isLogin: boolean;
  last_login: string;
  createdAt: string;
  updatedAt: string;
}

interface Admin {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  isLoading: boolean;
  loading: boolean;
  login: (data: any, type: 'user' | 'admin') => void;
  logout: (type: 'user' | 'admin') => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (data: any, type: 'user' | 'admin') => {
    if (type === 'user') {
      // Store full user data
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } else {
      const { email, name } = data;
      setAdmin({ email, name });
      localStorage.setItem('admin', JSON.stringify({ email, name }));
    }
  };

  const logout = async (type: 'user' | 'admin') => {
    try {
      // Call logout API endpoint
      const response = await fetch(`/api/${type === 'admin' ? 'admin/' : ''}logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear local storage and state
      if (type === 'user') {
        localStorage.removeItem('user');
        localStorage.removeItem('userToken');
        setUser(null);
        router.push('/signin');
      } else {
        localStorage.removeItem('admin');
        setAdmin(null);
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // Check user auth
      const userResponse = await fetch('/api/login', {
        method: 'GET',
        credentials: 'include',
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.success && userData.user) {
          // Store full user data
          setUser(userData.user);
        }
      }

      // Check admin auth
      const adminResponse = await fetch('/api/admin/login', {
        method: 'GET',
        credentials: 'include',
      });

      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        if (adminData.success && adminData.user) {
          const { email, name } = adminData.user;
          setAdmin({ email, name });
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication status on mount
    checkAuth();

    // Try to restore from localStorage
    const storedUser = localStorage.getItem('user');
    const storedAdmin = localStorage.getItem('admin');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      admin, 
      isLoading, 
      loading: isLoading,
      login, 
      logout, 
      checkAuth 
    }}>
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
