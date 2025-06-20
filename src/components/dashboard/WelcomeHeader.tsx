import React from 'react';

interface User {
  customer: string;
  isPaid: boolean;
  fore_closure: number;
  lender_name:string;
}

interface WelcomeHeaderProps {
  user: User;
}

const WelcomeHeader = ({ user }: WelcomeHeaderProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
        Welcome (Namaste) {user?.customer}!
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2">
        Your {user?.lender_name} loan outstanding {user?.isPaid ? "was" : "is"} ₹{user?.fore_closure}
      </p>
    </div>
  );
};

export default WelcomeHeader;
