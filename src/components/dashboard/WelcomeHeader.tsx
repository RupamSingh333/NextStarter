import React from 'react';

interface User {
  customer: string;
  isPaid: boolean;
  fore_closure: number;
  lender_name: string;
}

interface WelcomeHeaderProps {
  user: User;
  className?: string;
}

const WelcomeHeader = ({ user, className = '' }: WelcomeHeaderProps) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl px-4 py-4 md:px-6 md:py-6 shadow-sm mb-4 md:mb-6 w-full flex flex-col items-start ${className}`}
      style={{ zIndex: 20 }}
    >
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
        Welcome (Namaste) {user?.customer}!
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm md:text-base">
        Your {user?.lender_name} loan outstanding {user?.isPaid ? 'was' : 'is'} ₹{user?.fore_closure}
      </p>
    </div>
  );
};

export default WelcomeHeader;
