import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title:
        "RepayKaro - Loan Repayment Management",
    description: "Simplify your loan repayment process with RepayKaro. Track, plan, and manage your loans efficiently.",
    keywords: "loan repayment, loan management, financial planning, debt tracking, personal finance",
};

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Hero Section */}
            <main className="flex-grow">
                <section className="pt-20 pb-12 md:pt-32 md:pb-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                    Simplify Your Loan Repayment with RepayKaro
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                                    Managing loan repayments has never been easier. Track, plan, and repay your loans efficiently with our smart platform.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="/signin"
                                        className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        href="#features"
                                        className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <Image
                                    src="/images/carousel/carousel-01.png"
                                    alt="RepayKaro Platform"
                                    width={600}
                                    height={400}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-16 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                            Why Choose RepayKaro?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
                                <div className="w-12 h-12 bg-brand-500 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Easy Tracking
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Track all your loans in one place with our intuitive dashboard.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
                                <div className="w-12 h-12 bg-brand-500 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Smart Reminders
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Never miss a payment with automated reminders and notifications.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
                                <div className="w-12 h-12 bg-brand-500 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Quick Processing
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Fast and secure payment processing for all your loan repayments.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
} 