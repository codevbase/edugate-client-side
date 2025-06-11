import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <>
            <Helmet>
                <title>404 Not Found | EduGate</title>
            </Helmet>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, type: 'spring' }}
                    className="flex flex-col items-center"
                >
                    <motion.h1
                        className="text-[7rem] sm:text-[10rem] font-extrabold text-blue-600 drop-shadow-lg mb-2"
                        initial={{ y: -40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.7, type: 'spring' }}
                    >
                        404
                    </motion.h1>
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.7, type: 'spring' }}
                        className="mb-6"
                    >
                        {/* SVG Illustration */}
                        <svg width="180" height="120" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="90" cy="110" rx="70" ry="10" fill="#dbeafe" />
                            <circle cx="60" cy="60" r="30" fill="#3b82f6" opacity="0.15" />
                            <circle cx="120" cy="60" r="30" fill="#3b82f6" opacity="0.15" />
                            <ellipse cx="90" cy="70" rx="38" ry="18" fill="#60a5fa" opacity="0.25" />
                            <ellipse cx="90" cy="70" rx="28" ry="12" fill="#2563eb" opacity="0.18" />
                            <ellipse cx="90" cy="70" rx="18" ry="7" fill="#1e40af" opacity="0.12" />
                            <circle cx="90" cy="70" r="6" fill="#2563eb" />
                        </svg>
                    </motion.div>
                    <motion.h2
                        className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2 text-center"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.7, type: 'spring' }}
                    >
                        Oops! Page not found
                    </motion.h2>
                    <motion.p
                        className="text-lg text-blue-700 mb-6 text-center max-w-md"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.7, type: 'spring' }}
                    >
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </motion.p>
                    <motion.button
                        className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition text-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/')}
                        aria-label="Go to homepage"
                    >
                        Go to Homepage
                    </motion.button>
                </motion.div>
            </div>
        </>
    );
};

export default NotFound;