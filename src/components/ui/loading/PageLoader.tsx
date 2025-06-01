import React from 'react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary-500 animate-spin"></div>
          <div className="absolute inset-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-primary-500 animate-spin" style={{ animationDelay: '-0.3s' }}></div>
        </div>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 animate-pulse">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default PageLoader; 