import React from 'react';
import Image from 'next/image';
// import { PhoneIcon } from "@heroicons/react/24/outline";

interface User {
  customer: string;
  isPaid: boolean;
  fore_closure: number;
  lender_name: string;
  phone: string;
}

interface WelcomeHeaderProps {
  user: User;
  className?: string;
}

const WelcomeHeader = ({ user, className = '' }: WelcomeHeaderProps) => {
  console.log(user)
  return (
    <div
      className={`bg-white dark:bg-gray-900 px-4 py-4 md:px-6 md:py-6 mb-1 md:mb-1 w-full flex flex-col items-start ${className}`}
      style={{ zIndex: 20 }}
    >
    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex flex-wrap items-baseline justify-between w-full gap-2">
  <span className="flex items-center gap-2">
    <Image
      src="/images/namaste.svg"
      alt="Namaste gesture"
      width={20}
      height={20}
      className="inline-block"
    />
    <span>Welcome (Namaste)</span>
    {user?.customer}!
  </span>
  
  <span className="text-sm md:text-base font-normal flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
    {/* <PhoneIcon className="h-4 w-4 flex-shrink-0" /> */}
    {user?.phone}
  </span>
</h1>

      <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm md:text-base">
        Your {user?.lender_name} loan outstanding {user?.isPaid ? 'was' : 'is'} ₹{user?.fore_closure}
      </p>
      
    </div>
  );
};

export default WelcomeHeader;
