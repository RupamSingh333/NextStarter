'use client';

import React from 'react';

const Footer = () => {
  const handleCall = () => {
    window.location.href = 'tel:+1234567890';
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
              <a 
                href="tel:+918538945025" 
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                +91 8538945025
              </a>
              <a 
                href="mailto:rupamkumar333@gmail.com"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                rupamkumar333@gmail.com
              </a>
            </div>
          </div>

          {/* Company Info */}
          <div className="text-center md:text-right">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Codelabs India
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </div>

      {/* Call Button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={handleCall}
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
    </footer>
  );
};

export default Footer; 