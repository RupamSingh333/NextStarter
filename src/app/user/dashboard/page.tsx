'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import PaymentBreakdown from '@/components/dashboard/PaymentBreakdown';
// import Header from '@/components/home/Header';
// import Footer from '@/components/home/Footer';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const { user, loading , checkAuth} = useAuth();
  const [relativeLogin, setRelativeLogin] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    if (user?.last_login) {
      const formatted = formatDistanceToNow(new Date(user.last_login), { addSuffix: true });
      setRelativeLogin(formatted);
    }
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <main className="flex-1 flex flex-col">
          <div className="p-4 md:p-8 space-y-6 animate-pulse">
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
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout>
      <main className="flex-1 flex flex-col">
        <WelcomeHeader
          name={typeof user?.customer === 'string' ? user.customer : user?.phone || 'User'}
          loanAmount={Number(user?.fore_closure?.$numberDecimal || user?.fore_closure || 0)}
        />
        <PaymentBreakdown user={user} loading={loading} />
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center p-4 md:p-8">
          <p>Please upload a screenshot of your pending loan to get started.</p>
          <p className="mt-6">Click 'Upload Screenshot' in the sidebar to upload.</p>
        </div>
      </main>
    </DashboardLayout>
  );
}
