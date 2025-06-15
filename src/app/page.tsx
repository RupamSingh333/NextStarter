import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "RepayKaro - Loan Repayment Management",
    description: "Simplify your loan repayment process with RepayKaro. Track, plan, and manage your loans efficiently.",
    keywords: "loan repayment, loan management, financial planning, debt tracking, personal finance",
};

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Hero Section */}
            <main className="flex-grow">
                <section className="relative pt-20 pb-12 md:pt-32 md:pb-20 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 dark:opacity-20">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-400 via-transparent to-transparent"></div>
                    </div>
                    
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                                    Simplify Your{' '}
                                    <span className="text-purple-600 dark:text-purple-400">Loan Repayment</span>
                                    <br />
                                    with RepayKaro
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Managing loan repayments has never been easier. Track, plan, and repay your loans efficiently with our smart platform.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="/signin"
                                        className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        href="#features"
                                        className="inline-flex justify-center items-center px-8 py-4 border border-purple-200 dark:border-purple-800 text-base font-medium rounded-full text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all duration-300"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden md:block relative">
                                <div className="relative w-full h-[400px] transform hover:scale-105 transition-transform duration-500">
                                    <Image
                                        src="/images/carousel/carousel-01.png"
                                        alt="RepayKaro Platform"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Why Choose <span className="text-purple-600 dark:text-purple-400">RepayKaro</span>?
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Experience the future of loan management with our innovative features
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="group p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Easy Tracking
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Track all your loans in one place with our intuitive dashboard and real-time updates.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="group p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Smart Reminders
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Never miss a payment with automated reminders and personalized notifications.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="group p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    Quick Processing
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Fast and secure payment processing with instant confirmation and tracking.
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