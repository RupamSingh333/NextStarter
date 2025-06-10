'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UploadModal from '../dashboard/UploadModal';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
// import { TrashIcon } from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();
  const [uploadedScreenshots, setUploadedScreenshots] = useState<Array<{
    _id: string;
    screen_shot: string;
    isActive: boolean;
    createdAt: string;
  }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch existing screenshots when component mounts
  const fetchScreenshots = async () => {
    try {
      const response = await fetch('/api/screenshots', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        // console.log(data.screenshots);
        setUploadedScreenshots(data.screenshots || []);
      }
    } catch (error) {
      console.error('Error fetching screenshots:', error);
    }
  };

  const handleLogout = () => {
    logout('user');
  };
  
  useEffect(() => {
    fetchScreenshots();
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
        // Add the new screenshot to the list
        if (data.screen_shot) {
          setUploadedScreenshots(prev => [...prev, data.screen_shot]);
        }
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

  const handleDeleteScreenshot = async (screenshotId: string) => {
    // First ask for confirmation
    const confirmDelete = window.confirm('Are you sure you want to delete this screenshot?');
    
    if (!confirmDelete) {
      return;
    }

    // Show loading toast that will be updated based on the promise result
    toast.promise(
      // The delete operation promise
      (async () => {
        const response = await fetch(`/api/screenshots/${screenshotId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Failed to delete screenshot');
        }

        // Update state only after successful deletion
        setUploadedScreenshots(prev => prev.filter(screenshot => screenshot._id !== screenshotId));
        return data;
      })(),
      {
        loading: 'Deleting screenshot...',
        success: 'Screenshot deleted successfully!',
        error: (err) => err.message || 'Failed to delete screenshot'
      }
    );
  };

  const menuItems = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      label: 'Dashboard',
      href: '/user/dashboard',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Rewards',
      href: '/user/rewards',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4 4m0 0l4-4m-4 4V4" />
        </svg>
      ),
      label: 'Upload Screenshot',
      onClick: () => setIsUploadModalOpen(true),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 bg-blue-600 dark:bg-gray-950">
            <span className="text-xl font-bold text-white">RepayKarot</span>
            <button
              className="p-1 rounded-md md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 px-4 mt-6 space-y-2">
            {menuItems.map((item) => (
              item.onClick ? (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-white rounded-lg hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={`flex items-center px-4 py-3 text-gray-700 dark:text-white rounded-lg hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-white transition-colors ${
                    pathname === item.href ? 'bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-white' : ''
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              )
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-4 h-16">
            <button
              className="p-1 rounded-md"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        isUploading={isUploading}
        uploadedScreenshots={uploadedScreenshots}
        onDelete={handleDeleteScreenshot}
      />
    </div>
  );
};

export default DashboardLayout; 