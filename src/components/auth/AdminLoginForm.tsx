"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Image for potential illustrations
import Header from '@/components/home/Header';

export default function AdminLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("gaurav@gmail.com");
  const [password, setPassword] = useState("admin@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      console.log('>>>>>>>>>>>>', data);

      if (data.success) {
        login(data.user, 'admin');
        localStorage.setItem('adminToken', data.token || '');
        toast.success('Admin login successful!');
        router.push('/admin');
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
        toast.error(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setError(message);
      console.error('Admin login error:', error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="mt-4 flex items-center justify-center min-h-screen  dark:bg-gray-900 p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Left Panel: Admin Login Form */}
          <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:gradient-text"
              >
                <ChevronLeftIcon />
                Back to home
              </Link>
            </motion.div>

            <motion.h1
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-1.5 font-semibold text-gray-800 text-3xl sm:text-4xl lg:text-5xl dark:text-white/90"
            >
              Admin Panel
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8"
            >
              Enter your credentials to access the admin dashboard
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <form onSubmit={handleSubmit}>
                <div className="space-y-5 sm:space-y-6">
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-4 rounded-xl"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <Label>
                      Email <span className="text-red-500"> &nbsp; *</span>
                    </Label>
                    <motion.div whileFocus={{ scale: 1.01 }}>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        defaultValue={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2"
                      />
                    </motion.div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  >
                    <Label>
                      Password <span className="text-red-500"> &nbsp;*</span>
                    </Label>
                    <motion.div whileFocus={{ scale: 1.01 }}>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        defaultValue={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-2"
                      />
                    </motion.div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6"
                  >
                    <Button
                      disabled={loading || (email === '' || password === '')}
                      className="w-full gradient-bg hover:bg-purple-700 text-white rounded-xl py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                      variant="primary"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Logging in...
                        </div>
                      ) : (
                        'Login'
                      )}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Right Panel: Admin Welcome/Illustration Section */}
          <div className="hidden lg:flex w-1/2 p-6 sm:p-10 gradient-bg from-purple-500 to-purple-800 dark:from-purple-700 dark:to-purple-900 text-white flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* You can replace this with an actual admin illustration */}
              <Image
                src="/images/brand/brand-01.svg" // Placeholder image, replace with your own
                alt="Admin Welcome Illustration"
                width={200}
                height={200}
                className="mb-6 opacity-90 ml-16"
              />
              <h2 className="font-bold text-3xl sm:text-4xl mb-4 leading-tight">
                Admin Dashboard Access
              </h2>
              <p className="text-purple-100 text-lg mb-8 opacity-90">
                Manage users, loans, and system settings with comprehensive control.
              </p>
              {/* <Button
              variant="primary"
              className="bg-white text-purple-600 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300 dark:hover:bg-purple-900 transition-all duration-300 rounded-xl py-3 px-8 shadow-lg"
              onClick={() => router.push('/admin/docs')} // Example link, change as needed
            >
              Admin Docs
            </Button> */}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>

  );
} 