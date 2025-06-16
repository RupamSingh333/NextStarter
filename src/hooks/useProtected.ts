'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function useProtected(role: 'user' | 'admin') {
  const { isAuthenticatedUser, isAuthenticatedAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (role === 'user' && !isAuthenticatedUser) {
      router.push('/signin');
    }

    if (role === 'admin' && !isAuthenticatedAdmin) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticatedUser, isAuthenticatedAdmin, role, router]);
}
