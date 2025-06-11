'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import PaymentBreakdown from '@/components/dashboard/PaymentBreakdown';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const { user, loading, checkAuth } = useAuth();
  const [relativeLogin, setRelativeLogin] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    if (user?.last_login) {
      const formatted = formatDistanceToNow(new Date(user.last_login), { addSuffix: true });
      setRelativeLogin(formatted);
    }
  }, [user?.last_login]);

  if (loading) {
    return (
      <DashboardLayout>
        <Header />
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="container mx-auto px-4 py-8 space-y-6 animate-pulse">
            {/* Simulate WelcomeHeader */}
            <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />

            {/* Simulate PaymentBreakdown cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              ))}
            </div>

            {/* Simulate footer note */}
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mt-6" />
          </div>
        </main>
        <Footer />
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout>
      <Header />
      <main className="flex-1 overflow-y-auto pt-16">
        <div className="container mx-auto px-4 py-8">
          <WelcomeHeader
            name={user?.customer || ''}
            loanAmount={Number(user?.fore_closure) || 0}
          />
          <PaymentBreakdown />

          {/* Footer Info */}
          <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
            {relativeLogin && (
              <p>
                Last logged in:{' '}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {relativeLogin}
                </span>
              </p>
            )}
            <p className="mt-2 text-red-500">
              Note: Take a screenshot for upload after payment.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </DashboardLayout>
  );
}
