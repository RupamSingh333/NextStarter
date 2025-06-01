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
  const { user } = useAuth();
  const [relativeLogin, setRelativeLogin] = useState<string | null>(null);

  useEffect(() => {
    if (user?.last_login) {
      const formatted = formatDistanceToNow(new Date(user.last_login), { addSuffix: true });
      setRelativeLogin(formatted);
    }
  }, [user?.last_login]);

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
