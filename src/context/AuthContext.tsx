'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface DecimalValue {
  $numberDecimal: string;
}

interface Permission {
  module: string;
  actions: string[];
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
  permissions: Permission[]; // Added permissions field
  lender_name:string;
}

interface Admin {
  email: string;
  name: string;
  permissions: Permission[]; // Added permissions field
}

type LoginData = {
  user: User;
  admin: Admin;
};

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  isLoading: boolean;
  loading: boolean;
  isAuthenticatedUser: boolean;
  isAuthenticatedAdmin: boolean;
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
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);

  const clearCookies = useCallback(() => {
    document.cookie.split(';').forEach(cookie => {
      document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
  }, []);

  const clearAuthData = useCallback((type: 'user' | 'admin') => {
    if (type === 'user') {
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
      setUser(null);
      setIsAuthenticatedUser(false);
      if (window.location.pathname.startsWith('/user/')) {
        router.push('/signin');
      }
    } else {
      localStorage.removeItem('admin');
      localStorage.removeItem('admin_token');
      setAdmin(null);
      setIsAuthenticatedAdmin(false);
      if (window.location.pathname.startsWith('/admin/')) {
        router.push('/login');
      }
    }
    clearCookies();
  }, [router, clearCookies]);

  const login = useCallback((data: Partial<LoginData[keyof LoginData]>, type: 'user' | 'admin') => {
    if (type === 'user') {
      const userData = data as User;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticatedUser(true);
      router.push('/');
    } else {
      const adminData = data as Admin;
      const { email, name, permissions } = adminData;
      setAdmin({ email, name, permissions });
      localStorage.setItem('admin', JSON.stringify({ email, name, permissions }));
      setIsAuthenticatedAdmin(true);
      router.push('/admin');
    }
  }, [router]);

  const logout = useCallback(async (type: 'user' | 'admin') => {
    try {
      const response = await fetch(`/api/${type === 'admin' ? 'admin/' : ''}logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      console.log('Clearing auth data for:', type);
      clearAuthData(type);
      // if (type === 'admin') {
      //   router.push('/login');
      // } else {
      //   router.push('/signin');
      // }
    }
  }, [clearAuthData, router]);

  const checkAuth = useCallback(async () => {
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
          setUser(userData.user);
          setIsAuthenticatedUser(true);
          localStorage.setItem('user', JSON.stringify(userData.user));
          return;
        }
      }
      clearAuthData('user');

      // Check admin auth
      const adminResponse = await fetch('/api/admin/login', {
        method: 'GET',
        credentials: 'include',
      });
      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        if (adminData.success && adminData.user) {
          const { email, name, permissions } = adminData.user;
          setAdmin({ email, name, permissions });
          setIsAuthenticatedAdmin(true);
          localStorage.setItem('admin', JSON.stringify({ email, name, permissions }));
          return;
        }
      }
      clearAuthData('admin');
    } catch (error) {
      console.error('Auth check error:', error);
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/user/')) {
        clearAuthData('user');
      } else if (currentPath.startsWith('/admin/')) {
        clearAuthData('admin');
      }
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthData]);

  useEffect(() => {
    // Check localStorage first for quick UI update
    const storedUser = localStorage.getItem('user');
    const storedAdmin = localStorage.getItem('admin');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticatedUser(true);
      } catch (error:unknown) {
        if (error instanceof Error) {
    console.error('Failed to parse user data:', error.message);
  }
  localStorage.removeItem('user');
        localStorage.removeItem('user');
      }
    }
    
    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdmin(parsedAdmin);
        setIsAuthenticatedAdmin(true);
      } catch (error:unknown) {
        if (error instanceof Error) {
    console.error('Failed to parse user data:', error.message);
  }
  localStorage.removeItem('user');
        localStorage.removeItem('admin');
      }
    }

    // Then verify with server
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        isLoading,
        loading: isLoading,
        isAuthenticatedUser,
        isAuthenticatedAdmin,
        login,
        logout,
        checkAuth,
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











// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// interface DecimalValue {
//   $numberDecimal: string;
// }

// interface User {
//   _id: string;
//   phone: string;
//   customer: boolean;
//   fore_closure: DecimalValue;
//   settlement: DecimalValue;
//   minimum_part_payment: DecimalValue;
//   foreclosure_reward: DecimalValue;
//   settlement_reward: DecimalValue;
//   minimum_part_payment_reward: DecimalValue;
//   payment_type: number;
//   isPaid: boolean;
//   payment_url: string;
//   isLogin: boolean;
//   last_login: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Admin {
//   email: string;
//   name: string;
// }

// type LoginData = {
//   user: User;
//   admin: Admin;
// }

// interface AuthContextType {
//   user: User | null;
//   admin: Admin | null;
//   isLoading: boolean;
//   loading: boolean;
//   login: (data: Partial<LoginData[keyof LoginData]>, type: 'user' | 'admin') => void;
//   logout: (type: 'user' | 'admin') => void;
//   checkAuth: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);
//   const [admin, setAdmin] = useState<Admin | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const login = (data: Partial<LoginData[keyof LoginData]>, type: 'user' | 'admin') => {
//     if (type === 'user') {
//       // Store full user data
//       setUser(data as User);
//       localStorage.setItem('user', JSON.stringify(data));
//       // Redirect to home page after user login
//       router.push('/');
//     } else {
//       const { email, name } = data as Admin;
//       setAdmin({ email, name });
//       localStorage.setItem('admin', JSON.stringify({ email, name }));
//       // Redirect to admin dashboard after admin login
//       router.push('/admin');
//     }
//   };

//   const logout = async (type: 'user' | 'admin') => {
//     try {
//       // Call logout API endpoint
//       const response = await fetch(`/api/${type === 'admin' ? 'admin/' : ''}logout`, {
//         method: 'POST',
//         credentials: 'include',
//       });

//       if (!response.ok) {
//         throw new Error('Logout failed');
//       }

//       // Clear local storage and state
//       if (type === 'user') {
//         localStorage.removeItem('user');
//         localStorage.removeItem('userToken');
//         // Clear all cookies
//         document.cookie.split(';').forEach(cookie => {
//           document.cookie = cookie
//             .replace(/^ +/, '')
//             .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
//         });
//         setUser(null);
//         // Redirect and refresh
//         router.push('/signin');
//         window.location.reload();
//       } else {
//         localStorage.removeItem('admin');
//         // Clear all cookies
//         document.cookie.split(';').forEach(cookie => {
//           document.cookie = cookie
//             .replace(/^ +/, '')
//             .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
//         });
//         setAdmin(null);
//         // Redirect and refresh
//         router.push('/login');
//         window.location.reload();
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//       // Even if API call fails, clear local state and redirect
//       if (type === 'user') {
//         localStorage.removeItem('user');
//         localStorage.removeItem('userToken');
//         // Clear all cookies
//         document.cookie.split(';').forEach(cookie => {
//           document.cookie = cookie
//             .replace(/^ +/, '')
//             .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
//         });
//         setUser(null);
//         router.push('/signin');
//         window.location.reload();
//       } else {
//         localStorage.removeItem('admin');
//         // Clear all cookies
//         document.cookie.split(';').forEach(cookie => {
//           document.cookie = cookie
//             .replace(/^ +/, '')
//             .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
//         });
//         setAdmin(null);
//         router.push('/login');
//         window.location.reload();
//       }
//     }
//   };

//   const clearAuthData = (type: 'user' | 'admin') => {
//     if (type === 'user') {
//       localStorage.removeItem('user');
//       localStorage.removeItem('token');
//       setUser(null);
//       if (window.location.pathname.startsWith('/user/')) {
//         router.push('/signin');
//       }
//     } else if (type === 'admin') {
//       localStorage.removeItem('admin_token');
//       setAdmin(null);
//       if (window.location.pathname.startsWith('/admin/')) {
//         router.push('/login');
//       }
//     }

//     // Clear all cookies
//     document.cookie.split(';').forEach(cookie => {
//       document.cookie = cookie
//         .replace(/^ +/, '')
//         .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
//     });
//   };

//   const checkAuth = async () => {
//     setIsLoading(true);
//     try {
//       // ==== Check USER Auth ====
//       const userResponse = await fetch('/api/login', {
//         method: 'GET',
//         credentials: 'include',
//       });

//       const userData = await userResponse.json();

//       if (userResponse.ok && userData.success) {
//         setUser(userData.user);
//       } else {
//         clearAuthData('user');
//       }

//       // ==== Check ADMIN Auth ====
//       const adminResponse = await fetch('/api/admin/login', {
//         method: 'GET',
//         credentials: 'include',
//       });

//       const adminData = await adminResponse.json();

//       // console.log('>Admin Auth Response:', adminData);
      

//       if (adminResponse.ok && adminData.success && adminData.user) {
//         const { email, name } = adminData.user;
//         setAdmin({ email, name });
//       } else {
//         clearAuthData('admin');
//       }
//     } catch (error) {
//       console.error('Auth check error:', error);
//       // fallback: check current path and clear relevant auth
//       const currentPath = window.location.pathname;
//       if (currentPath.startsWith('/user/')) {
//         clearAuthData('user');
//       } else if (currentPath.startsWith('/admin/')) {
//         clearAuthData('admin');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   useEffect(() => {
//     // Check authentication status on mount
//     checkAuth();

//     // Try to restore from localStorage
//     const storedUser = localStorage.getItem('user');
//     const storedAdmin = localStorage.getItem('admin');

//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     if (storedAdmin) {
//       setAdmin(JSON.parse(storedAdmin));
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{
//       user,
//       admin,
//       isLoading,
//       loading: isLoading,
//       login,
//       logout,
//       checkAuth
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }
