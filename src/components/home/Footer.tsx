'use client';

import React, { useState } from 'react';

const Footer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(prev => !prev);
  };
  

  const makePhoneCall = () => {
    window.location.href = 'tel:+918178953143';
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Developer Info */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Designed & Developed by{' '}
              <span className="font-semibold text-gray-800 dark:text-gray-200">Rupam Singh</span>
            </p>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-1 text-sm text-gray-500 dark:text-gray-500">
              <button 
                onClick={makePhoneCall}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                +91 8178953143
              </button>
              <a 
                href="mailto:hr@repaykaro.com"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                hr@repaykaro.com
              </a>
            </div>
          </div>

          {/* Company Info */}
          <div className="text-center md:text-right">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              RepayKaro
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </div>

      {/* Call Button */}
      <div className="fixed bottom-4 right-4 z-20">
        <button
          onClick={toggleDrawer}
          className="flex items-center space-x-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
        className={`fixed right-4 bottom-20 h-[450px] w-[300px] bg-white dark:bg-gray-800 shadow-xl rounded-lg transform transition-all duration-300 ease-in-out z-30 ${
          isDrawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-t-lg">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Contact Us
          </h2>
          <button
            onClick={toggleDrawer}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors flex items-center justify-center"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4 h-[calc(100%-44px)] overflow-y-auto">
          <div className="space-y-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
              <h3 className="font-medium text-base text-indigo-600 dark:text-indigo-400 mb-1">
                Welcome to RepayKaro
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                We&apos;re here to help you with any questions or assistance you need.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={makePhoneCall}
                className="flex items-center justify-between w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </span>
                <span>8178953143</span>
              </button>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-xs">
                <p className="font-medium text-gray-900 dark:text-white mb-1">Working Hours</p>
                <p className="text-gray-600 dark:text-gray-300">Monday to Friday</p>
                <p className="text-gray-600 dark:text-gray-300">9 AM to 6 PM</p>
              </div>

              <div className="text-xs">
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  You can also reach us via email at:
                </p>
                <a 
                  href="mailto:hr@repaykaro.com"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  hr@repaykaro.com
                </a>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              <p>Your satisfaction is our priority.</p>
              <p className="italic mt-1">Thank you for choosing RepayKaro!</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 