import React, { useEffect, useRef } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  content: string;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept, content }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Add animation classes
  const modalClasses = `fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ${
    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
  }`;

  const modalContentClasses = `bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 border border-gray-200 dark:border-gray-700 ${
    isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
  }`;

  return (
    <div className={modalClasses}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div ref={modalRef} className={modalContentClasses}>
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Terms & Conditions</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            I Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal; 