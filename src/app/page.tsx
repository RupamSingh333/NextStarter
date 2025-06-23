"use client";

import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import ScrollAnimation from '@/components/common/ScrollAnimation';
import TermsModal from '@/components/common/TermsModal';
import { useState } from 'react';

export default function HomePage() {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [isVisible, setIsVisible] = useState(false);
    const handleAcceptTerms = () => {
        setAcceptedTerms(true);
        setIsModalOpen(false);
    };
    // useEffect(() => {
    //     const handleScroll = () => {
    //         const rocketSection = document.getElementById('rocket-section');
    //         if (!rocketSection) return;

    //         const rect = rocketSection.getBoundingClientRect();
    //         const isInView = rect.top < window.innerHeight * 0.75; // Trigger when 75% in view

    //         if (isInView) {
    //             setIsVisible(true);
    //             window.removeEventListener('scroll', handleScroll); // Remove listener after triggering
    //         }
    //     };

    //     window.addEventListener('scroll', handleScroll);
    //     handleScroll(); // Check on mount in case already visible

    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, []);

    return (
        <div className="min-h-screen flex flex-col">

            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center pt-20 pb-12 md:pt-32 md:pb-20 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden  shadow-lg">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-400 via-transparent to-transparent animate-pulse"></div>
                        <div className="absolute top-0 left-0 w-full h-full">
                            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                            <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                        </div>
                    </div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <ScrollAnimation animation="slideLeft" className="space-y-8" delay={300}>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight animate-fadeIn">
                                    Simplify Your{' '}
                                    <span className="gradient-text animate-gradient">Loan Repayment</span>
                                    <br />
                                    <span className="inline-block animate-bounce-subtle">with RepayKaro</span>
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                                    Managing loan repayments has never been easier. Track, plan, and repay your loans efficiently with our smart platform.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn" style={{ animationDelay: '0.7s' }}>
                                    <Link
                                        href="/signin"
                                        className="hover-button inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-2xl text-white gradient-bg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all duration-500 shadow-xl hover:shadow-2xl animate-pulse-subtle"
                                    >
                                        Check Your Offer
                                    </Link>
                                    <Link
                                        href="#features"
                                        className="hover-button inline-flex justify-center items-center px-8 py-4 border border-purple-200 dark:border-purple-800 text-base font-medium rounded-2xl text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-xl animate-float-subtle"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </ScrollAnimation>
                            <ScrollAnimation animation="slideRight" className="hidden md:block relative" delay={500}>
                                <div className="relative w-full h-[400px] transform hover:scale-105 transition-transform duration-700 rounded-2xl shadow-xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-gradient-shift"></div>
                                    <Image
                                        src="/images/carousel/carousel-04.png"
                                        alt="RepayKaro Platform"
                                        fill
                                        className="object-contain animate-float"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent animate-shine"></div>
                                </div>
                            </ScrollAnimation>
                        </div>
                    </div>
                </section>

                {/* RepayKaro Overview */}
                <section className="pb-10 md:pb-15 bg-gray-50 dark:bg-gray-800  shadow-inner-top">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl"> {/* Increased max-width */}
                        <div className="flex flex-col md:flex-row items-center gap-12"> {/* Flex container */}
                            {/* Image Column (Left) */}

                            <ScrollAnimation animation="slideLeft" className="relative h-64 md:h-66 flex items-center justify-center  overflow-hidden " delay={900}>
                                <div className="absolute inset-0 bg-gradient-to-r  animate-gradient-shift"></div>

                                <Image
                                    src="/images/mission_white.svg"
                                    alt="Decorative background"
                                    width={178}
                                    height={100}
                                    className="dark:hidden "

                                />
                                <Image
                                    src="/images/mission_black.svg"
                                    alt="Decorative background"
                                    width={178}
                                    height={100}
                                    className="hidden dark:block "

                                />

                                <div className="absolute inset-0  from-white/10 to-transparent animate-shine"></div>
                            </ScrollAnimation>


                            {/*  (Right) */}
                            <div className="w-full">
                                <ScrollAnimation animation="fade" delay={400}>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fadeIn">
                                        About <span className="gradient-text animate-gradient">RepayKaro</span>
                                    </h2>

                                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.6s' }}>

                                        RepayKaro specializes in helping lenders recover bad debts efficiently, while offering customers the motivation to repay by providing attractive incentives.
                                    </p>

                                </ScrollAnimation>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Lender & Customer Platform */}
                <section className="py-20 bg-white dark:bg-gray-900  shadow-inner-top">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <ScrollAnimation animation="slideLeft" className="space-y-6" delay={500}>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fadeIn">
                                    Lender & Customer <span className="gradient-text animate-gradient">Platform</span>
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.7s' }}>
                                    RepayKaro is the part of True Business Minds Pvt. Ltd. and is designed with both the lender and customer in mind. Our approach focuses on creating a positive experience where customers are encouraged to settle their dues with added benefits, and lenders can recover bad debts with fewer hassles.
                                </p>
                                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4 animate-fadeIn" style={{ animationDelay: '0.9s' }}>Incentives that Matter</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed animate-fadeIn" style={{ animationDelay: '1.1s' }}>
                                    We provide a variety of incentives such as discounts on repayment, gift coupons, and reward points. These incentives motivate customers to act promptly, reducing the chances of unpaid debts turning into more serious financial issues.
                                </p>
                            </ScrollAnimation>
                            <ScrollAnimation animation="slideRight" className="relative h-64 md:h-96 bg-purple-100 dark:bg-purple-900/20 rounded-3xl flex items-center justify-center hover-card overflow-hidden shadow-xl" delay={700}>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-gradient-shift"></div>
                                <Image
                                    src="/images/carousel/carousel-02.png"
                                    alt="Marketing Illustration for Lender & Customer Platform"
                                    fill
                                    className="object-contain rounded-3xl animate-float"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent animate-shine"></div>
                            </ScrollAnimation>
                        </div>
                    </div>
                </section>

                {/* Additional Features */}
                <section className="py-20 bg-gray-50 dark:bg-gray-800  shadow-inner-top">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <ScrollAnimation animation="slideLeft" className="relative h-64 md:h-96 bg-purple-100 dark:bg-purple-900/20 rounded-3xl flex items-center justify-center hover-card overflow-hidden shadow-xl" delay={500}>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-gradient-shift"></div>
                                <Image
                                    src="/images/carousel/carousel-03.png"
                                    alt="Web Development Illustration for Debt Recovery Solutions"
                                    fill
                                    className="object-contain rounded-3xl animate-float"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent animate-shine"></div>
                            </ScrollAnimation>
                            <ScrollAnimation animation="slideRight" className="space-y-6" delay={700}>
                                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 animate-fadeIn">Avoid Escalations and Conflicts</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.5s' }}>
                                    By giving customers the option to settle their loans with incentives, we minimize the chances of negative confrontations, complaints, or escalations. This results in smoother relationships between lenders and borrowers.
                                </p>
                                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4 animate-fadeIn" style={{ animationDelay: '0.7s' }}>Flexible Repayment Options</h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.9s' }}>
                                    Customers are provided with different repayment solutions depending on their financial situation. Whether they want to pay off pending dues, foreclose a loan, or settle the loan completely, we provide them with the flexibility to choose an option that works best for them.
                                </p>
                            </ScrollAnimation>

                        </div>
                    </div>
                </section>

                {/* How RepayKaro Works */}
                <section className="py-20 bg-gray-50 dark:bg-gray-800  shadow-inner-top">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-4xl mx-auto mb-16">
                            <ScrollAnimation animation="fade" delay={400}>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fadeIn">
                                    How <span className="gradient-text animate-gradient">RepayKaro</span> Works
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                                    RepayKaro provides a seamless process for both lenders and borrowers. Here&apos;s how it works:
                                </p>
                            </ScrollAnimation>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    step: 1,
                                    title: "Lenders Partner with RepayKaro",
                                    description: "Lenders can easily integrate our services into their debt recovery process by partnering with RepayKaro. This allows them to offer repayment incentives to their customers, encouraging faster debt recovery."
                                },
                                {
                                    step: 2,
                                    title: "Customers Receive Repayment Offers",
                                    description: "Once a lender partners with us, eligible customers will receive notifications via email or SMS informing them of the outstanding dues and the available incentives."
                                },
                                {
                                    step: 3,
                                    title: "Customers Make Their Choice",
                                    description: "Customers can choose from various options based on their financial situation: Settle Pending Dues, Loan Settlement, or Foreclosure of Loan."
                                },
                                {
                                    step: 4,
                                    title: "Incentives and Rewards",
                                    description: "Once customers have successfully repaid their dues, they receive their rewards in the form of gift coupons, cashback, or other exciting offers."
                                },
                                {
                                    step: 5,
                                    title: "Hassle-Free Debt Recovery",
                                    description: "With RepayKaro, lenders can recover their bad debts with minimal friction. Customers feel motivated to clear their dues, thanks to the various incentives on offer."
                                }
                            ].map((item, index) => (
                                <ScrollAnimation
                                    key={item.step}
                                    animation="scale"
                                    delay={index * 200}
                                    className="hover-card"
                                >
                                    <div className="p-8 rounded-3xl shadow-xl bg-white dark:bg-gray-800 text-center h-full border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-600">
                                        <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-2xl shadow-md animate-pulse-subtle">
                                            {item.step}
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight animate-fadeIn">{item.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed animate-fadeIn" style={{ animationDelay: '0.3s' }}>{item.description}</p>
                                    </div>
                                </ScrollAnimation>
                            ))}

                        </div>

                    </div>




                </section>


                {/* Incentives and Rewards Section */}
                <section className="py-2 bg-gray-50 dark:bg-gray-800 shadow-inner-top">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl"> {/* Increased max-width */}
                        <div className="flex flex-col md:flex-row items-center gap-12"> {/* Flex container */}
                            {/* Image Column (Left) */}
                            <ScrollAnimation animation="slideLeft" className="relative h-64 md:h-96   flex items-center justify-center  overflow-hidden " delay={500}>
                                <div className="absolute inset-0 bg-gradient-to-r  animate-gradient-shift"></div>
                                <Image
                                    src="/images/cup.png"
                                    alt="FAQ Illustration"

                                    className=' object-contain rounded-3xl animate-float'
                                    width={272}
                                    height={472}
                                />

                                <div className="absolute inset-0  from-white/10 to-transparent animate-shine"></div>
                            </ScrollAnimation>


                            {/*  (Right) */}
                            <div className="w-full">
                                <ScrollAnimation animation="fade" className="mb-12" delay={400}>
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fadeIn">
                                        Incentives and Rewards: A <span className="gradient-text animate-gradient">Win-Win Solution</span>
                                    </h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                                        RepayKaro takes a unique approach to debt recovery by offering customers exciting incentives in return for prompt repayment. These rewards can be redeemed on major online platforms, making the repayment process more engaging and rewarding for customers.
                                    </p>
                                    <div className="mt-8 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
                                        <Link
                                            href="#get-started"
                                            className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-2xl text-white gradient-bg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all duration-500 shadow-xl hover:shadow-2xl animate-pulse-subtle"
                                        >
                                            Get started
                                        </Link>
                                    </div>
                                </ScrollAnimation>


                            </div>
                        </div>
                    </div>
                </section>
                {/* Partners Section */}
                <section className="py-2 bg-gray-50 dark:bg-gray-800  shadow-inner-top">
                    <div className="relative min-h-[700px]  mt-1">
                        {/* Cat Background Image */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/images/cat_white.svg"
                                alt="Decorative background"
                                fill
                                className="object-cover rounded-3xl animate-float dark:hidden "

                            />
                            <Image
                                src="/images/cat_black.svg"
                                alt="Decorative background"
                                fill
                                className="hidden object-cover rounded-3xl animate-float dark:block "

                            />
                        </div>

                        {/* Content Container (positioned above background) */}
                        <div className="relative  p-8 md:p-12 max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fadeIn">
                                There will : A <span className="gradient-text animate-gradient">be partner</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                                RepayKaro takes a unique approach to debt recovery by offering customers exciting incentives in return for prompt repayment. These rewards can be redeemed on major online platforms, making the repayment process more engaging and rewarding for customers.
                            </p>
                        </div>

                        {/* Animation Style */}
                        <style jsx global>{`
    @keyframes float {
      0%, 100% { transform: translateY(0) scale(.9); }
      50% { transform: translateY(-20px) scale(1); }
    }
  `}</style>
                    </div>
                </section>


                {/* Get Started / Contact Form */}
                <section id="get-started" className="py-20 bg-white dark:bg-gray-900  shadow-inner-top">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                        <ScrollAnimation animation="fade" className="text-center mb-12" delay={400}>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fadeIn">
                                Ready to experience <span className="gradient-text animate-gradient">stress-free debt recovery</span>?
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2 animate-fadeIn" style={{ animationDelay: '0.5s' }}>100% Satisfaction Guaranteed</p>
                            <p className="text-lg text-gray-600 dark:text-gray-300 animate-fadeIn" style={{ animationDelay: '0.7s' }}>Reach out to us via our contact form, and a member of our team will be in touch to help you get started.</p>
                        </ScrollAnimation>
                        
                        <ScrollAnimation animation="slideUp" className="space-y-6" delay={600}>
                            <form className="space-y-6 bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-fadeIn">
                                {/* Form fields with animations */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="animate-fadeIn" style={{ animationDelay: '0.8s' }}>
                                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                                        <input type="text" name="first-name" id="first-name" autoComplete="given-name" className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-3" />
                                    </div>
                                    <div className="animate-fadeIn" style={{ animationDelay: '1s' }}>
                                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                        <input type="text" name="last-name" id="last-name" autoComplete="family-name" className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-3" />
                                    </div>
                                </div>
                                <div className="animate-fadeIn" style={{ animationDelay: '1.2s' }}>
                                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                    <input id="email-address" name="email-address" type="email" autoComplete="email" className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-3" />
                                </div>
                                <div className="animate-fadeIn" style={{ animationDelay: '1.4s' }}>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                    <textarea id="message" name="message" rows={4} className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-3"></textarea>
                                </div>
                                <div className="text-center pt-4 animate-fadeIn" style={{ animationDelay: '1.6s' }}>
                                    <div className="flex items-center justify-center mb-4">
                                        <input
                                            type="checkbox"
                                            id="accept-terms"
                                            checked={acceptedTerms}
                                            onChange={() => setAcceptedTerms(!acceptedTerms)}
                                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label htmlFor="accept-terms" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            I agree to the <span onClick={() => setIsModalOpen(true)} className="text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">Terms & Conditions Applied</span>
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className={`hover-button inline-flex justify-center items-center px-10 py-4 border border-transparent text-base font-medium rounded-2xl text-white gradient-bg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all duration-500 shadow-xl hover:shadow-2xl ${!acceptedTerms ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700 hover:scale-105 animate-pulse-subtle'}`}
                                        disabled={!acceptedTerms}
                                    >
                                        Start Your Project
                                    </button>
                                </div>
                            </form>
                        </ScrollAnimation>
                        {/* <Image
                            id="rocket-section"
                            src="/images/rocket.svg"
                            alt="Rocket Illustration"
                            
                            width={272}
                            height={472}
                            style={{
                                animationName: isVisible ? 'rocketLaunch' : 'none',
                                animationDuration: '2s',
                                animationTimingFunction: 'ease-in',
                                animationFillMode: 'forwards',
                                animationIterationCount: 1,
                                animationPlayState: isVisible ? 'running' : 'paused'
                            }}
                        />

                        <style jsx global>{`
    @keyframes rocketLaunch {
      0% { transform: translateY(0) rotate(0); opacity: 0; }
      30% { transform: translateY(-20px) rotate(-5deg); }
      70% { transform: translateY(-100px) rotate(2deg); }
      100% { transform: translateY(-200px) rotate(0); opacity: 1; }
    }
  `}</style> */}

                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-gray-50 dark:bg-gray-800  shadow-inner-top">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl"> {/* Increased max-width */}
                        <div className="flex flex-col md:flex-row items-center gap-12"> {/* Flex container */}
                            {/* Image Column (Left) */}

                            <ScrollAnimation animation="slideLeft" className="relative h-64 md:h-96 flex items-center justify-center  overflow-hidden " delay={500}>
                                <div className="absolute inset-0 bg-gradient-to-r  animate-gradient-shift"></div>
                                <Image
                                    src="/images/FAQ_White.svg"
                                    alt="FAQ Illustration"

                                    className='object-contain rounded-3xl animate-float'
                                    width={272}
                                    height={472}
                                />

                                <div className="absolute inset-0  from-white/10 to-transparent animate-shine"></div>
                            </ScrollAnimation>


                            {/* FAQ Content Column (Right) */}
                            <div className="w-full">
                                <ScrollAnimation animation="fade" className="mb-12" delay={400}>
                                    <h2 className="text-3xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 animate-fadeIn">
                                        <span className="gradient-text animate-gradient">FAQ</span> - Frequently Asked Questions
                                    </h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                                        Get knowledge beforehand.
                                    </p>
                                </ScrollAnimation>

                                <div className="space-y-6">
                                    {[
                                        {
                                            question: "What is RepayKaro?",
                                            answer: "RepayKaro is a platform that helps lenders recover bad debts by providing attractive repayment incentives to customers, promoting a smoother debt recovery process."
                                        },
                                        {
                                            question: "How do incentives work?",
                                            answer: "Customers receive incentives like discounts, gift coupons, or reward points upon successful repayment. These can be redeemed on various leading platforms."
                                        },
                                        {
                                            question: "Is my data secure?",
                                            answer: "Yes, we prioritize the security of your data. We use industry-standard encryption and security protocols to protect your information."
                                        }
                                    ].map((faq, index) => (
                                        <ScrollAnimation
                                            key={index}
                                            animation="slideUp"
                                            delay={400 + (index * 200)}
                                            className="hover-card"
                                        >
                                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md animate-fadeIn" style={{ animationDelay: `${0.8 + (index * 0.2)}s` }}>
                                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                                                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                                            </div>
                                        </ScrollAnimation>
                                    ))}
                                </div>

                            </div>

                        </div>
                    </div>
                </section>

            </main>

            <Footer />

            <TermsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAccept={handleAcceptTerms}
                content={TERMS_AND_CONDITIONS_CONTENT}
            />
        </div>
    );
}

const TERMS_AND_CONDITIONS_CONTENT = `Trems & Conditions
Terms and Conditions – Communication Consent
By providing your phone number and using our services, you agree and consent to receive communications from TRUE BUSINESS MINDS PRIVATE LIMITED, including but not limited to:

RCS (Rich Communication Services) messages
WhatsApp messages
Standard SMS (Short Message Service) messages
These communications may include important updates, promotional offers, transactional information, reminders, and other relevant content related to our services.

Consent and Opt-In:
You acknowledge that by submitting your phone number and interacting with our services (e.g., signing up, making a purchase, or contacting support), you are providing express consent to receive the above communications.

Message Frequency:
Message frequency may vary based on your interaction with our services. Standard message and data rates may apply, depending on your mobile service provider.

Opt-Out Option:
You can opt out of receiving such communications at any time by replying "STOP" to any SMS or WhatsApp message, or by contacting us directly at support@truebusinessminds.com.

Privacy:
We respect your privacy and are committed to protecting your personal information. Please review our Privacy Policy for more details on how we collect, use, and protect your data
`; 