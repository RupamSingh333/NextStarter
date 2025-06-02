import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { TrashIcon } from '@heroicons/react/24/outline';

interface Screenshot {
  _id: string;
  screen_shot: string;
  isActive: boolean;
  createdAt: string;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadedScreenshots: Screenshot[];
  onDelete: (id: string) => Promise<void>;
}

const UploadModal = ({ 
  isOpen, 
  onClose, 
  onUpload, 
  isUploading,
  uploadedScreenshots,
  onDelete 
}: UploadModalProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; screenshotId: string | null }>({
    isOpen: false,
    screenshotId: null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size should be less than 10MB');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      try {
        await onUpload(selectedFile);
        // Reset state
        setPreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  const handleDeleteClick = (screenshotId: string) => {
    setDeleteConfirmation({ isOpen: true, screenshotId });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmation.screenshotId) {
      await onDelete(deleteConfirmation.screenshotId);
      setDeleteConfirmation({ isOpen: false, screenshotId: null });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all">
          {/* Delete Confirmation Dialog */}
          {deleteConfirmation.isOpen && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-sm rounded-lg bg-white dark:bg-gray-800 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Delete Screenshot
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Are you sure you want to delete this screenshot? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmation({ isOpen: false, screenshotId: null })}
                    className="rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              disabled={isUploading}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Upload Section */}
            <div className="flex-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                Upload Payment Screenshot
              </h3>

              <div className="mt-2">
                <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-600 px-6 py-10">
                  <div className="text-center">
                    {preview ? (
                      <div className="mb-4">
                        <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded-lg" />
                      </div>
                    ) : (
                      <svg
                        className="mx-auto h-12 w-12 text-gray-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    
                    <label
                      htmlFor="file-upload"
                      className={`relative cursor-pointer rounded-md bg-white dark:bg-gray-800 font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 ${
                        isUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        disabled={isUploading}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                    <p className="text-xs leading-5 text-gray-600 dark:text-gray-400 mt-2">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!selectedFile || isUploading}
                  className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${
                    selectedFile && !isUploading
                      ? 'bg-indigo-600 hover:bg-indigo-500'
                      : 'bg-indigo-400 cursor-not-allowed'
                  }`}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>

            {/* Uploaded Screenshots Section */}
            <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-4 md:pt-0 md:pl-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Uploaded Screenshots
              </h4>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {uploadedScreenshots.length > 0 ? (
                  uploadedScreenshots.map((screenshot) => (
                    <div 
                      key={screenshot._id}
                      className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                    >
                      <img
                        src={screenshot.screen_shot}
                        alt="Payment Screenshot"
                        className="w-full h-auto"
                      />
                      <button
                        onClick={() => handleDeleteClick(screenshot._id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        title="Delete screenshot"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                        {new Date(screenshot.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No screenshots uploaded yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal; 