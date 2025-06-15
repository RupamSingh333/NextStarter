'use client';

import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [companyName, setCompanyName] = useState('RepayKaro');
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'hr@repaykaro.com';
  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_MOBILE || '+918178953143';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set company name after component mounts to avoid hydration mismatch
    setCompanyName(process.env.NEXT_PUBLIC_COMPANY_NAME || 'RepayKaro');
    
    // Add fade-in animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(prev => !prev);
  };
  

  const makePhoneCall = () => {
    window.location.href = 'tel:+918178953143';
  };

  return (
    <footer className={`bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 border-t border-purple-100 dark:border-purple-900/20 mt-auto transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Developer Info */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Designed & Developed by{' '}
              <span className="font-semibold text-purple-600 dark:text-purple-400">{companyName}</span>
            </p>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 text-sm">
              <button 
                onClick={makePhoneCall}
                className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 transform hover:scale-105"
              >
                {companyPhone}
              </button>
              <a 
                href={`mailto:${companyEmail}`}
                className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 transform hover:scale-105"
              >
                {companyEmail}
              </a>
            </div>
          </div>

          {/* Company Info */}
          <div className="text-center md:text-right">
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
              {companyName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </div>

      {/* Call Button */}
      <div className="fixed bottom-4 right-4 z-20">
        <button
          onClick={toggleDrawer}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span>Call us</span>
        </button>
      </div>

      {/* Right Side Drawer */}
      <div
        className={`fixed right-4 bottom-20 h-[450px] w-[300px] bg-white dark:bg-gray-800 shadow-2xl rounded-2xl transform transition-all duration-300 ease-in-out z-30 ${
          isDrawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 dark:border-purple-900/20 bg-purple-50 dark:bg-purple-900/10 rounded-t-2xl">
          <h2 className="text-base font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Contact Us
          </h2>
          <button
            onClick={toggleDrawer}
            className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-full transition-colors duration-300"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 h-[calc(100%-72px)] overflow-y-auto">
          <div className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
              <h3 className="font-medium text-base text-purple-600 dark:text-purple-400 mb-2">
                Welcome to {companyName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We&apos;re here to help you with any questions or assistance you need.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={makePhoneCall}
                className="flex items-center justify-between w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </span>
                <span>8178953143</span>
              </button>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                <p className="font-medium text-purple-600 dark:text-purple-400 mb-2">Working Hours</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Monday to Friday</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">9 AM to 6 PM</p>
              </div>

              <div className="text-sm">
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  You can also reach us via email at:
                </p>
                <a 
                  href={`mailto:${companyEmail}`}
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {companyEmail}
                </a>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              <p>Your satisfaction is our priority.</p>
              <p className="italic mt-1 text-purple-600 dark:text-purple-400">Thank you for choosing {companyName}!</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 