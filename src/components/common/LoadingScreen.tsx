"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '@/context/LoadingContext';

const LoadingScreen = () => {
    const { isLoading } = useLoading();
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        if (isLoading) {
            document.body.style.overflow = 'hidden';
        } else {
            // Add minimum display time of 2 seconds
            setTimeout(() => {
                setShowLoading(false);
                document.body.style.overflow = 'unset';
            }, 600);
        }
    }, [isLoading]);

    return (
        <AnimatePresence mode="wait">
            {showLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                        duration: 0.8,
                        ease: "easeInOut"
                    }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-gray-900"
                >
                    <div className="relative flex flex-col items-center">
                        {/* Loading Text */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ 
                                delay: 0.2, 
                                duration: 0.8,
                                ease: "easeOut"
                            }}
                            className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-6"
                        >
                            RepayKaro
                        </motion.div>

                        {/* Loading Animation */}
                        <div className="relative w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1.5,
                                    ease: 'easeInOut'
                                }}
                                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen; 