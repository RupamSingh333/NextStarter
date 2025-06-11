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

type LoginData = {
  user: User;
  admin: Admin;
}

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  isLoading: boolean;
  loading: boolean;
  login: (data: Partial<LoginData[keyof LoginData]>, type: 'user' | 'admin') => void;
  logout: (type: 'user' | 'admin') => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (data: Partial<LoginData[keyof LoginData]>, type: 'user' | 'admin') => {
    if (type === 'user') {
      // Store full user data
      setUser(data as User);
      localStorage.setItem('user', JSON.stringify(data));
      // Redirect to home page after user login
      router.push('/');
    } else {
      const { email, name } = data as Admin;
      setAdmin({ email, name });
      localStorage.setItem('admin', JSON.stringify({ email, name }));
      // Redirect to admin dashboard after admin login
      router.push('/admin');
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
        // Clear all cookies
        document.cookie.split(';').forEach(cookie => {
          document.cookie = cookie
            .replace(/^ +/, '')
            .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });
        setUser(null);
        // Redirect and refresh
        router.push('/signin');
        window.location.reload();
      } else {
        localStorage.removeItem('admin');
        // Clear all cookies
        document.cookie.split(';').forEach(cookie => {
          document.cookie = cookie
            .replace(/^ +/, '')
            .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });
        setAdmin(null);
        // Redirect and refresh
        router.push('/login');
        window.location.reload();
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local state and redirect
      if (type === 'user') {
        localStorage.removeItem('user');
        localStorage.removeItem('userToken');
        // Clear all cookies
        document.cookie.split(';').forEach(cookie => {
          document.cookie = cookie
            .replace(/^ +/, '')
            .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });
        setUser(null);
        router.push('/signin');
        window.location.reload();
      } else {
        localStorage.removeItem('admin');
        // Clear all cookies
        document.cookie.split(';').forEach(cookie => {
          document.cookie = cookie
            .replace(/^ +/, '')
            .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });
        setAdmin(null);
        router.push('/login');
        window.location.reload();
      }
    }
  };

  const clearAuthData = (type: 'user' | 'admin') => {
    if (type === 'user') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      if (window.location.pathname.startsWith('/user/')) {
        router.push('/signin');
      }
    } else if (type === 'admin') {
      localStorage.removeItem('admin_token');
      setAdmin(null);
      if (window.location.pathname.startsWith('/admin/')) {
        router.push('/login');
      }
    }

    // Clear all cookies
    document.cookie.split(';').forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
  };

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // ==== Check USER Auth ====
      const userResponse = await fetch('/api/login', {
        method: 'GET',
        credentials: 'include',
      });

      const userData = await userResponse.json();

      if (userResponse.ok && userData.success) {
        setUser(userData.user);
      } else {
        clearAuthData('user');
      }

      // ==== Check ADMIN Auth ====
      const adminResponse = await fetch('/api/admin/login', {
        method: 'GET',
        credentials: 'include',
      });

      const adminData = await adminResponse.json();

      if (adminResponse.ok && adminData.success && adminData.user) {
        const { email, name } = adminData.user;
        setAdmin({ email, name });
      } else {
        clearAuthData('admin');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // fallback: check current path and clear relevant auth
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/user/')) {
        clearAuthData('user');
      } else if (currentPath.startsWith('/admin/')) {
        clearAuthData('admin');
      }
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
