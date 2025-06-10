"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      // Show first error as toast
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        // Use auth context to handle login
        login(data.user, 'admin');

        // Get callback URL or default to dashboard
        const params = new URLSearchParams(window.location.search);
        const callbackUrl = params.get('callbackUrl');
        const redirectUrl = callbackUrl || '/admin/dashboard';

        toast.success('Login successful!');
        router.push(redirectUrl);
      } else {
        setError(data.message || 'Login failed. Please try again.');
        toast.error(data.message || 'Login failed. Please try again.');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setError(message);
      console.error('Login error:', error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const errors = validateForm();

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
          Back to home
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
              Admin Login
            </motion.h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your credentials to access the admin panel
            </p>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-error-500 dark:text-error-400 bg-error-50 dark:bg-error-900/30 p-3 rounded"
                >
                  {error}
                </motion.div>
              )}
              <div>
                <Label>
                  Email Address <span className="text-error-500">*</span>
                </Label>
                <motion.div whileFocus={{ scale: 1.01 }}>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    defaultValue={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="mt-1"
                    error={touched.email && !!errors.email}
                    hint={touched.email && errors.email ? errors.email : undefined}
                  />
                </motion.div>
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <motion.div whileFocus={{ scale: 1.01 }}>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    defaultValue={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="mt-1"
                    error={touched.password && !!errors.password}
                    hint={touched.password && errors.password ? errors.password : undefined}
                  />
                </motion.div>
              </div>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  disabled={loading || Object.keys(errors).length > 0}
                  className="w-full"
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
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 