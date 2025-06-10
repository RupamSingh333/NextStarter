"use client";
import Input from "@/components/form/input/InputField";
import OTPInput from "@/components/form/input/OTPInput";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function SignInForm() {
  // const router = useRouter();
  const { login } = useAuth();
  const [mobileNumber, setMobileNumber] = useState("8538945025");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!mobileNumber || mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: mobileNumber
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setIsOtpSent(true);
        setError(null);
        setTimer(60); // Start 60 seconds timer
        toast.success('OTP sent successfully!');
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
        toast.error('Failed to send OTP. Please try again.');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send OTP. Please try again.';
      setError(message);
      console.error('Login error:', error);
      toast.error(message);
    }
    finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      toast.error('Please enter a valid 4-digit OTP');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: mobileNumber,
          otp: otp,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify OTP');
      }
      if (data.success) {
        // Use auth context to handle login and redirect
        login(data.user, 'user');
        localStorage.setItem('userToken', data.token || '');
        toast.success('Login successful!');
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
        toast.error(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Invalid OTP. Please try again.';
      setError(message);
      console.error('Verification error:', error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto pt-3 sm:pt-6 mb-2"
      >
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </motion.div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="mb-3 sm:mb-6">
            <motion.h1 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-1.5 font-semibold text-gray-800 text-xl sm:text-2xl lg:text-3xl dark:text-white/90"
            >
              Sign In
            </motion.h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isOtpSent ? `Enter the OTP sent to ${mobileNumber}` : "Enter your mobile number to receive OTP"}
            </p>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp}>
              <div className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-error-500 dark:text-error-400 bg-error-50 dark:bg-error-900/30 p-3 rounded"
                  >
                    {error}
                  </motion.div>
                )}
                {!isOtpSent ? (
                  <div>
                    <Label>
                      Mobile Number <span className="text-error-500">*</span>
                    </Label>
                    <motion.div whileFocus={{ scale: 1.01 }}>
                      <Input
                        type="tel"
                        placeholder="Enter your mobile number"
                        defaultValue={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit mobile number"
                        className="mt-1"
                      />
                    </motion.div>
                  </div>
                ) : (
                  <div>
                    <Label>
                      Enter OTP <span className="text-error-500">*</span>
                    </Label>
                    <div className="mt-2">
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <OTPInput
                          length={4}
                          onChange={setOtp}
                        />
                      </motion.div>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-4 gap-3 sm:gap-0"
                    >
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={timer > 0}
                        className={`text-sm ${
                          timer > 0
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-brand-500 hover:text-brand-600"
                        }`}
                      >
                        Resend OTP {timer > 0 && `(${timer}s)`}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOtpSent(false);
                          setOtp("");
                          setError(null);
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Change Mobile Number
                      </button>
                    </motion.div>
                  </div>
                )}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    disabled={loading}
                    className="w-full"
                    variant="primary"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {isOtpSent ? 'Verifying...' : 'Sending OTP...'}
                      </div>
                    ) : (
                      isOtpSent ? 'Verify OTP' : 'Send OTP'
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}