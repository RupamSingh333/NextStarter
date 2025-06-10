'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAuth } from '@/context/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend);

// Define types for decimal values
type DecimalValue = {
  $numberDecimal: string;
} | string | number | undefined | null;

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

const PaymentBreakdown = () => {
  const { user, loading } = useAuth();

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left side - Chart */}
      <div className="lg:col-span-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Payment Breakdown</h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-64 h-64 relative">
            <Doughnut data={data} options={options} />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[rgb(147,171,255)]"></div>
              <span className="text-gray-600 dark:text-gray-300">Foreclosure</span>
              <span className="font-semibold">₹{foreclosureAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[rgb(178,200,255)]"></div>
              <span className="text-gray-600 dark:text-gray-300">Settlement</span>
              <span className="font-semibold">₹{settlementAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[rgb(255,220,155)]"></div>
              <span className="text-gray-600 dark:text-gray-300">Min Payment</span>
              <span className="font-semibold">₹{minimumPaymentAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Payment Cards */}
      <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Foreclosure Amount Card */}
        <div className="bg-[rgb(147,171,255)] rounded-xl p-6 text-white">
          <h3 className="text-lg font-medium mb-4">Foreclosure Amount</h3>
          <div className="text-3xl font-bold mb-2">₹{foreclosureAmount.toFixed(2)}</div>
          <div className="text-sm opacity-90">{foreclosureReward.toFixed(2)} reward</div>
          <button className="mt-4 bg-white text-[rgb(147,171,255)] rounded-lg px-4 py-2 font-medium">
            Proceed to Payment
          </button>
        </div>

        {/* Settlement Amount Card */}
        <div className="bg-[rgb(63,66,150)] rounded-xl p-6 text-white">
          <h3 className="text-lg font-medium mb-4">Settlement Amount</h3>
          <div className="text-3xl font-bold mb-2">₹{settlementAmount.toFixed(2)}</div>
          <div className="text-sm opacity-90">{settlementReward.toFixed(2)} reward</div>
          <button className="mt-4 bg-white text-[rgb(63,66,150)] rounded-lg px-4 py-2 font-medium">
            Proceed to Payment
          </button>
        </div>

        {/* Minimum Payment Card */}
        <div className="bg-[rgb(147,171,255)] rounded-xl p-6 text-white">
          <h3 className="text-lg font-medium mb-4">Minimum Payment</h3>
          <div className="text-3xl font-bold mb-2">₹{minimumPaymentAmount.toFixed(2)}</div>
          <div className="text-sm opacity-90">{minimumPaymentReward.toFixed(2)} reward</div>
          <button className="mt-4 bg-white text-[rgb(147,171,255)] rounded-lg px-4 py-2 font-medium">
            Proceed to Payment
          </button>
        </div>

        {/* Payment Status Card */}
        <div className="bg-[rgb(220,252,231)] rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4 text-gray-800">Payment Status</h3>
          <div className="text-3xl font-bold mb-2 text-green-600">
            {user.isPaid ? 'Completed' : 'Pending'}
          </div>
          <div className="text-sm text-green-700">
            {user.isPaid ? 'Paid' : 'Not Paid'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentBreakdown; 