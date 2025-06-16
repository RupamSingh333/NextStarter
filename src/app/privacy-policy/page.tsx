"use client";

import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">Privacy Policy</h1>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 leading-relaxed text-gray-700 dark:text-gray-300 space-y-6">
                    <p><strong>Effective Date: October 26, 2023</strong></p>
                    
                    <p>Your privacy is important to True Business Minds Private Limited and RepayKaro. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website repaykaro.com and use our services.</p>

                    <h2><strong>1. Information We Collect</strong></h2>
                    <h3>Personal Information:</h3>
                    <ul>
                        <li><strong>Contact Information:</strong> Name, email address, phone number.</li>
                        <li><strong>Financial Information:</strong> Details related to loan repayments, transaction history (we do not store sensitive financial data like full bank account numbers or credit card details directly).</li>
                        <li><strong>Usage Data:</strong> Information about how you use our website and services, including IP address, browser type, operating system, and pages visited.</li>
                    </ul>

                    <h2><strong>2. How We Use Your Information</strong></h2>
                    <p>We use the information we collect for various purposes, including:</p>
                    <ul>
                        <li>To provide, operate, and maintain our services.</li>
                        <li>To process transactions and send related information, including confirmation and invoices.</li>
                        <li>To send you technical notices, updates, security alerts, and support and administrative messages.</li>
                        <li>To respond to your comments, questions, and requests and provide customer service.</li>
                        <li>To communicate with you about products, services, offers, promotions, rewards, and events offered by True Business Minds Private Limited and others, and provide news and information we think will be of interest to you.</li>
                        <li>To monitor and analyze trends, usage, and activities in connection with our services.</li>
                        <li>To personalize and improve the services and provide advertisements, content, or features that match your profiles or interests.</li>
                    </ul>

                    <h2><strong>3. Sharing of Information</strong></h2>
                    <p>We may share information about you as follows or as otherwise described in this Privacy Policy:</p>
                    <ul>
                        <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</li>
                        <li>In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law, regulation, or legal process.</li>
                        <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of True Business Minds Private Limited or others.</li>
                        <li>In connection with, or during negotiations of, any merger, sale of company assets, financing or acquisition of all or a portion of our business by another company.</li>
                        <li>With your consent or at your direction.</li>
                    </ul>

                    <h2><strong>4. Data Security</strong></h2>
                    <p>We implement reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>

                    <h2><strong>5. Your Choices</strong></h2>
                    <p>You may opt out of receiving promotional communications from us by following the instructions in those communications or by contacting us directly.</p>

                    <h2><strong>6. Changes to This Policy</strong></h2>
                    <p>We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice.</p>

                    <h2><strong>7. Contact Us</strong></h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                    <p><strong>True Business Minds Private Limited</strong><br/>
                    Email: hr@truebusinessminds.com<br/>
                    Phone: +91 7428400144</p>
                </div>
            </main>
            <Footer />
        </div>
    );
} 