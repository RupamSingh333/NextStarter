"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggleButton } from '../common/ThemeToggleButton';
import UploadModal from '../dashboard/UploadModal';
import { toast } from 'react-hot-toast';


const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('screenshot', file);

      const response = await fetch('/api/screenshots', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Screenshot uploaded successfully!');
        setIsUploadModalOpen(false);
      } else {
        toast.error(data.message || 'Failed to upload screenshot');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload screenshot');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    logout('user');
  };

  // Loading state UI
  const LoadingHeader = () => (
    <header className={`fixed top-0 left-0 w-full transition-all duration-300 z-50 ${
      isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 relative w-[120px] md:w-[150px] h-[40px] transform hover:scale-105 transition-transform">
            <Link href="/" className="block w-full h-full">
              <Image
                src="/images/logo/rpk.png"
                alt="RepayKarot"
                fill
                className="object-contain dark:hidden"
                priority
              />
              <Image
                src="/images/logo/rpk.png"
                alt="RepayKarot"
                fill
                className="object-contain hidden dark:block"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggleButton />
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-700 animate-pulse"></div>
              <div className="h-4 w-24 bg-purple-200 dark:bg-purple-700 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggleButton />
            <div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-700 animate-pulse"></div>
          </div>
        </div>
      </div>
    </header>
  );

  // Show loading state while checking authentication
  if (loading) {
    return <LoadingHeader />;
  }

  // Early return if no user to prevent type errors
  if (!user) {
    return (
      <header className={`fixed top-0 left-0 w-full transition-all duration-300 z-50 ${
        isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 relative w-[120px] md:w-[150px] h-[40px] transform hover:scale-105 transition-transform">
              <Link href="/" className="block w-full h-full">
                <Image
                  src="/images/logo/rpk.png"
                  alt="RepayKarot"
                  fill
                  className="object-contain dark:hidden"
                  priority
                />
                <Image
                  src="/images/logo/rpk.png"
                  alt="RepayKarot"
                  fill
                  className="object-contain hidden dark:block"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <ThemeToggleButton />
              <Link
                href="/signin"
                className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <ThemeToggleButton />
              <Link
                href="/signin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`fixed top-0 left-0 w-full transition-all duration-300 z-50 ${
      isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 relative w-[120px] md:w-[150px] h-[40px] transform hover:scale-105 transition-transform">
            <Link href="/" className="block w-full h-full">
              <Image
                src="/images/logo/rpk.png"
                alt="RepayKarot"
                fill
                className="object-contain dark:hidden"
                priority
              />
              <Image
                src="/images/logo/rpk.png"
                alt="RepayKarot"
                fill
                className="object-contain hidden dark:block"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggleButton />
            <div className="relative group">
              <button className="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 focus:outline-none transition-colors duration-300">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
                  {typeof user.customer === 'string' ? user.customer[0] : user.phone[0]}
                </div>
                <span className="font-medium">{user.phone}</span>
                <svg
                  className="w-5 h-5 transition-transform group-hover:rotate-180 duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100">
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  {user.phone}
                </div>
                <Link
                  href="/user/dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  href="/user/rewards"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                >
                  Rewards
                </Link>

                <button onClick={() => setIsUploadModalOpen(true)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 border-t border-gray-200 dark:border-gray-700">
                  Upload Screenshot
                </button>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 border-t border-gray-200 dark:border-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggleButton />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 focus:outline-none transition-all duration-300"
            >
              <span className="sr-only">Open menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white text-lg transform hover:scale-110 transition-transform duration-300">
                    {user.phone[0]}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">{user.phone}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">User</div>
                  </div>
                </div>
              </div>
              <Link
                href="/user/dashboard"
                className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="/user/rewards"
                className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg transition-colors duration-200"
              >
                Rewards
              </Link>

              <button onClick={() => setIsUploadModalOpen(true)} className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg transition-colors duration-200">
                Upload Screenshot
              </button>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUpload}
          isUploading={isUploading}
        />
      </div>
    </header>
  );
};

export default Header; 