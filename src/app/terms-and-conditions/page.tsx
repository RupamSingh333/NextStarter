"use client";

import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

export default function TermsAndConditionsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">Terms & Conditions</h1>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 leading-relaxed text-gray-700 dark:text-gray-300 space-y-6 whitespace-pre-wrap">
                    {`Trems & Conditions
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
`}
                </div>
            </main>
            <Footer />
        </div>
    );
} 