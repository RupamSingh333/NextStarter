'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
// import { useAuth } from '@/context/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend);

// Define types for decimal values
type DecimalValue = {
  $numberDecimal: string;
} | string | number | undefined | null;

interface User {
  fore_closure: DecimalValue;
  settlement: DecimalValue;
  minimum_part_payment: DecimalValue;
  foreclosure_reward: DecimalValue;
  settlement_reward: DecimalValue;
  minimum_part_payment_reward: DecimalValue;
  isPaid: boolean;
  payment_url?: string;
}

// Helper function to safely parse decimal values
const parseDecimalValue = (value: DecimalValue): number => {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  if (typeof value === 'object' && '$numberDecimal' in value) {
    return parseFloat(value.$numberDecimal);
  }
  return 0;
};

const PaymentBreakdown = ({user, loading}: {user: User | null, loading: boolean}) => {

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!user) {
    return null;
  }


  // Safely convert decimal values to numbers
  const foreclosureAmount = parseDecimalValue(user.fore_closure);
  const settlementAmount = parseDecimalValue(user.settlement);
  const minimumPaymentAmount = parseDecimalValue(user.minimum_part_payment);
  const foreclosureReward = parseDecimalValue(user.foreclosure_reward);
  const settlementReward = parseDecimalValue(user.settlement_reward);
  const minimumPaymentReward = parseDecimalValue(user.minimum_part_payment_reward);

  const data = {
    labels: ['Foreclosure', 'Settlement', 'Minimum Payment'],
    datasets: [
      {
        data: [foreclosureAmount, settlementAmount, minimumPaymentAmount],
        backgroundColor: [
          'rgb(147, 171, 255)',
          'rgb(178, 200, 255)',
          'rgb(255, 220, 155)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 p-2 md:p-4">
      {/* Left side - Chart */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        className="lg:col-span-6 bg-white dark:bg-gray-800 rounded-3xl p-4 md:p-6 shadow-xl border border-gray-100 dark:border-gray-700"
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 dark:text-white">Payment Breakdown</h2>
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-8">
          <div className="w-40 h-40 md:w-64 md:h-64 relative flex-shrink-0">
            <Doughnut data={data} options={options} />
          </div>
          <div className="flex flex-col gap-3 md:gap-4 w-full md:w-auto text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[rgb(147,171,255)]"></div>
              <span className="text-gray-600 dark:text-gray-300">Foreclosure</span>
              <span className="font-semibold dark:text-white">₹{foreclosureAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[rgb(178,200,255)]"></div>
              <span className="text-gray-600 dark:text-gray-300">Settlement</span>
              <span className="font-semibold dark:text-white">₹{settlementAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[rgb(255,220,155)]"></div>
              <span className="text-gray-600 dark:text-gray-300">Min Payment</span>
              <span className="font-semibold dark:text-white">₹{minimumPaymentAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right side - Payment Cards */}
      <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {/* Foreclosure Amount Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="bg-[rgb(147,171,255)] rounded-3xl p-4 md:p-6 text-white shadow-xl flex flex-col justify-between hover:scale-105 transition-transform duration-300 transform-gpu"
        >
          <div>
            <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">Foreclosure Amount</h3>
            <div className="text-2xl md:text-3xl font-bold mb-2">₹{foreclosureAmount.toFixed(2)}</div>
            <div className="text-xs md:text-sm opacity-90">{foreclosureReward.toFixed(2)} reward</div>
          </div>
          {user.payment_url && (
            <a
              href={user.payment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 md:mt-4 bg-white text-[rgb(147,171,255)] rounded-full px-4 md:px-6 py-2 md:py-3 font-medium text-center hover:bg-gray-100 transition-colors duration-300 shadow-md text-sm md:text-base"
            >
              Proceed to Payment
            </a>
          )}
        </motion.div>

        {/* Settlement Amount Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="bg-[rgb(63,66,150)] rounded-3xl p-4 md:p-6 text-white shadow-xl flex flex-col justify-between hover:scale-105 transition-transform duration-300 transform-gpu"
        >
          <div>
            <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">Settlement Amount</h3>
            <div className="text-2xl md:text-3xl font-bold mb-2">₹{settlementAmount.toFixed(2)}</div>
            <div className="text-xs md:text-sm opacity-90">{settlementReward.toFixed(2)} reward</div>
          </div>
          {user.payment_url && (
            <a
              href={user.payment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 md:mt-4 bg-white text-[rgb(63,66,150)] rounded-full px-4 md:px-6 py-2 md:py-3 font-medium text-center hover:bg-gray-100 transition-colors duration-300 shadow-md text-sm md:text-base"
            >
              Proceed to Payment
            </a>
          )}
        </motion.div>

        {/* Minimum Payment Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="bg-[rgb(147,171,255)] rounded-3xl p-4 md:p-6 text-white shadow-xl flex flex-col justify-between hover:scale-105 transition-transform duration-300 transform-gpu"
        >
          <div>
            <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">Minimum Payment</h3>
            <div className="text-2xl md:text-3xl font-bold mb-2">₹{minimumPaymentAmount.toFixed(2)}</div>
            <div className="text-xs md:text-sm opacity-90">{minimumPaymentReward.toFixed(2)} reward</div>
          </div>
          {user.payment_url && (
            <a
              href={user.payment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 md:mt-4 bg-white text-[rgb(147,171,255)] rounded-full px-4 md:px-6 py-2 md:py-3 font-medium text-center hover:bg-gray-100 transition-colors duration-300 shadow-md text-sm md:text-base"
            >
              Proceed to Payment
            </a>
          )}
        </motion.div>

        {/* Payment Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className={`rounded-3xl p-4 md:p-6 shadow-xl flex flex-col justify-between ${user.isPaid ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}
        >
          <div>
            <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">Payment Status</h3>
            <div className={`text-2xl md:text-3xl font-bold mb-2 ${user.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
              {user.isPaid ? 'Completed' : 'Pending'}
            </div>
            <div className={`text-xs md:text-sm ${user.isPaid ? 'text-green-700' : 'text-orange-700'}`}>
              {user.isPaid ? 'Paid' : 'Not Paid'}
            </div>
          </div>
          {!user.isPaid && user.payment_url && (
            <a
              href={user.payment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 md:mt-4 bg-white text-orange-600 rounded-full px-4 md:px-6 py-2 md:py-3 font-medium text-center hover:bg-gray-100 transition-colors duration-300 shadow-md text-sm md:text-base"
            >
              Complete Payment
            </a>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentBreakdown; 