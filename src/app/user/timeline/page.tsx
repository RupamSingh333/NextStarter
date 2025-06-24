'use client';
import { motion } from 'framer-motion';
import AnimatedTimeline from '@/components/timeline/AnimatedTimeline';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import {
    UserIcon,
    CheckCircleIcon,
    CreditCardIcon,
    GiftIcon,
    CalendarIcon,
    StarIcon, ClockIcon

} from 'lucide-react';
import Head from 'next/head';

interface Timeline {
    _id: string;
    customer_id: string;
    action: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}


export default function Home() {
    const icons = [
        UserIcon,
        CheckCircleIcon,
        CreditCardIcon,
        GiftIcon,
        CalendarIcon,
        StarIcon, ClockIcon
    ];
    const hasFetched = useRef(false);
    const { user } = useAuth();
    const [timeline, setTimeline] = useState<Timeline[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTimeline = async () => {
        try {
            const response = await fetch('/api/timeline', {
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setTimeline(data.data); // make sure your API returns { success, data: [...] }
            }
        } catch (error) {
            console.error('Error fetching timeline:', error);
        } finally {
            setLoading(false);
            hasFetched.current = true;
        }
    };

    useEffect(() => {
        if (hasFetched.current) return;
        fetchTimeline();
    }, []);

    return (
        <DashboardLayout>
            <Head>
              <title>Timeline</title>
            </Head>
            <main className="flex-1 flex flex-col overflow-y-auto min-h-0 p-0">
                <div className="sticky top-0 z-20 bg-white dark:bg-gray-800">
                  {user && <WelcomeHeader user={user as any} />}
                </div>
                <div className="pt-2 md:pt-4 p-2 md:p-4 lg:p-8">
                    {loading ? (
                        <div className="max-w-2xl mx-auto p-6">
                            <div className="relative border-l-2 border-gray-300 dark:border-gray-700 pl-6">
                                {[1, 2, 3].map((_, i) => {
                                    const Icon = icons[i % icons.length];
                                    return (
                                        <motion.div
                                            key={i}
                                            initial="hidden"
                                            animate="visible"
                                            transition={{ duration: 0.6, delay: i * 0.2 }}
                                            className="mb-10 last:mb-0 relative"
                                        >
                                            {/* Icon */}
                                            <div className="absolute -left-[50px] top-1.5 bg-white dark:bg-gray-900 p-3 rounded-full shadow-md">
                                                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>

                                            {/* Loading Card */}
                                            <motion.div
                                                whileHover={{
                                                    y: -5,
                                                    scale: 1.02,
                                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                                }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                                className="bg-white dark:bg-gray-900 p-4 rounded-md shadow-md \
                       border border-transparent hover:border-blue-500 \
                       hover:shadow-[0_0_10px_2px_rgba(59,130,246,0.7)] \
                       transition-all duration-300 ease-in-out"
                                            >
                                                <div className="text-sm text-gray-400">Loading...</div>
                                                <h3 className="text-lg font-semibold text-gray-400">Fetching title...</h3>
                                                <p className="mt-1 text-sm text-gray-400">Loading description...</p>
                                            </motion.div>
                                        </motion.div>
                                    );
                                })}
                            </div></div>
                    ) : (
                        <div className="max-w-2xl mx-auto p-6">
                            <AnimatedTimeline items={timeline} />
                        </div>
                    )}

                </div>
            </main>
        </DashboardLayout>
    );
}
