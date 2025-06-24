'use client';

import ScratchCards from '@/components/dashboard/ScratchCards';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
// import Header from '@/components/home/Header';
// import Footer from '@/components/home/Footer';
import DashboardLayout from '@/components/layout/DashboardLayout';
// import { formatDistanceToNow } from 'date-fns';
// import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Head from 'next/head';

export default function RewardsPage() {

  const { user } = useAuth();
  // const [relativeLogin, setRelativeLogin] = useState<string | null>(null);

  // useEffect(() => {
  //   if (user?.last_login) {
  //     const formatted = formatDistanceToNow(new Date(user.last_login), { addSuffix: true });
  //     setRelativeLogin(formatted);
  //   }
  // }, [user?.last_login]);

  return (
    <DashboardLayout>
      <Head>
        <title>Rewards</title>
      </Head>
      <main className="flex-1 flex flex-col overflow-y-auto min-h-0 p-0">
        <div className="sticky top-0 z-20 bg-white dark:bg-gray-800">
          {user && <WelcomeHeader user={user as any} />}
        </div>
        <div className="pt-2 md:pt-4 p-2 md:p-4 lg:p-8">
          <ScratchCards />
        </div>
      </main>
      {/* <Footer /> */}
    </DashboardLayout>
  );
} 