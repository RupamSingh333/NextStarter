import React from 'react';

interface WelcomeHeaderProps {
  name: string;
  loanAmount: number;
}

const WelcomeHeader = ({ name, loanAmount }: WelcomeHeaderProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
        Welcome (Namaste) {name}!
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2">
        Your RepayKarot loan outstanding is ₹{loanAmount.toFixed(2)}
      </p>
    </div>
  );
};

export default WelcomeHeader; 