'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DecimalValue {
  $numberDecimal: string;
}

interface User {
  _id: string;
  customer: string;
  phone: string;
  fore_closure: string;
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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/login', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        if (window.location.pathname === '/' || window.location.pathname === '/signin') {
          router.push('/user/dashboard');
        }
      } else {
        setUser(null);
        if (window.location.pathname.startsWith('/user')) {
          router.push('/signin');
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setUser(null);
        router.push('/');
        window.location.reload();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Initial check only if user is null
  useEffect(() => {
    if (!user) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  // Window focus check with better control
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let isCheckingAuth = false;

    const handleFocus = () => {
      if (!isCheckingAuth && !user) {
        isCheckingAuth = true;
        timeout = setTimeout(() => {
          checkAuth().finally(() => {
            isCheckingAuth = false;
          });
        }, 300);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, logout }}>
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
