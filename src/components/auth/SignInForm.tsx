"use client";
import Input from "@/components/form/input/InputField";
import OTPInput from "@/components/form/input/OTPInput";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from 'react-hot-toast';

export default function SignInForm() {
  const router = useRouter();
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
          otp: otp
        }),
        credentials: 'include' // Important for handling cookies
      });

      const data = await response.json();

      if (data.success) {
        // Get the callback URL from query parameters
        const params = new URLSearchParams(window.location.search);
        const callbackUrl = params.get('callbackUrl');
        
        // Redirect to callback URL if exists, otherwise to dashboard
        const redirectUrl = callbackUrl || '/user/dashboard';
        router.push(redirectUrl);
        
        // Force a page refresh to update all states
        window.location.reload();
        toast.success('Login successful!');
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid OTP. Please try again.';
      setError(message);
      console.error('Verification error:', error);
      toast.error(message);
    }

    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full px-4 sm:px-6">
      <div className="w-full max-w-md sm:pt-6 mx-auto mb-3">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-4 sm:mb-6">
            <h1 className="mb-2 font-semibold text-gray-800 text-2xl dark:text-white/90 sm:text-3xl">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isOtpSent ? `Enter the OTP sent to ${mobileNumber}` : "Enter your mobile number to receive OTP"}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp}>
              <div className="space-y-5">
                {error && (
                  <div className="text-sm text-error-500 dark:text-error-400 bg-error-50 dark:bg-error-900/30 p-3 rounded">
                    {error}
                  </div>
                )}
                {!isOtpSent ? (
                  <div>
                    <Label>
                      Mobile Number <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="tel"
                      placeholder="Enter your mobile number"
                      defaultValue={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit mobile number"
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <div>
                    <Label>
                      Enter OTP <span className="text-error-500">*</span>
                    </Label>
                    <div className="mt-2">
                      <OTPInput
                        length={4}
                        onChange={setOtp}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-4 gap-3 sm:gap-0">
                      <button
                        type="button"
                        onClick={() => {
                          setIsOtpSent(false);
                          setOtp("");
                          setError(null);
                          setTimer(0);
                        }}
                        className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                      >
                        Change Mobile Number
                      </button>
                      <button
                        type="button"
                        onClick={() => timer === 0 && handleSendOtp()}
                        disabled={timer > 0}
                        className={`text-sm ${timer > 0
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-brand-500 hover:text-brand-600 dark:text-brand-400'
                          }`}
                      >
                        {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                      </button>
                    </div>
                  </div>
                )}
                <div>
                  <Button
                    className="w-full mt-2"
                    size="sm"
                    disabled={loading}
                  >
                    {loading ? "Please wait..." : isOtpSent ? "Verify OTP" : "Send OTP"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}