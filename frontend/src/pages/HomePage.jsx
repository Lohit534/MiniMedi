import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../utils/auth';
import { toast } from 'react-toastify';
import MiniChatbot from '../components/MiniChatbot';

// Use simple icon components or move them to a separate file if used elsewhere
// ... (Keeping the Icon definitions for now if they are not in a shared file)

const StethoscopeIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M4.8 2.3A.3.3 0 0 0 5 2h14a.3.3 0 0 0 .2-.3V2a.3.3 0 0 0-.2-.3H5a.3.3 0 0 0-.2.3v.3Z" />
        <path d="M6 5v20" />
        <path d="M18 5v20" />
        <path d="M6 12a6 6 0 0 1 12 0" />
        <path d="M11 20h2" />
    </svg>
);

const LogoIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M4.8 2.3A.3.3 0 0 0 5 2h14a.3.3 0 0 0 .2-.3V2a.3.3 0 0 0-.2-.3H5a.3.3 0 0 0-.2.3v.3Z" />
        <path d="M6 5v11a4 4 0 0 0 8 0V5" />
        <path d="M18 5v4" />
        <circle cx="12" cy="16" r="3" />
    </svg>
);

// Custom icons based on the image
const RobotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-500">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" y1="16" x2="8" y2="16" />
        <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-500">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-500">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const ActivityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-500">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

const UserGroupIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-500">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-500">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300 flex flex-col items-start text-left">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
            <Icon />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
            {description}
        </p>
    </div>
);

const HomePage = ({ setIsChatbotOpen }) => {
    // Scroll to top on component mount to ensure mobile users see the hero section
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Hero Section */}
            <section className="pt-20 pb-20 px-6 bg-blue-50/50 dark:bg-blue-950/20">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                        <span className="text-blue-600 dark:text-blue-400">MiniMedi</span> - <span className="text-purple-600 dark:text-purple-400">Your AI Health</span>
                        <br />
                        <span className="text-purple-600 dark:text-purple-400">Companion</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed text-center">
                        Get instant health insights, symptom analysis, and personalized recommendations powered by advanced AI technology
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/ai-checker" className="bg-black dark:bg-white dark:text-black text-white px-8 py-3.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all">
                            Try AI Checker
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </Link>
                        {getToken() && (
                            <button
                                onClick={() => setIsChatbotOpen(true)}
                                className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-800 px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Chat with AI
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Why Choose MiniMedi?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={RobotIcon}
                        title="AI-Powered Analysis"
                        description="Advanced artificial intelligence analyzes your symptoms and provides accurate health insights in seconds."
                    />
                    <FeatureCard
                        icon={ShieldIcon}
                        title="Secure & Private"
                        description="Your health data is encrypted and protected. We prioritize your privacy and security above all."
                    />
                    <FeatureCard
                        icon={ClockIcon}
                        title="24/7 Availability"
                        description="Get health insights anytime, anywhere. Our AI assistant is always ready to help you."
                    />
                    <FeatureCard
                        icon={ActivityIcon}
                        title="Comprehensive Reports"
                        description="Receive detailed health reports with risk assessments and personalized recommendations."
                    />
                    <FeatureCard
                        icon={UserGroupIcon}
                        title="For Everyone"
                        description="Suitable for all ages and health concerns. From minor symptoms to general health queries."
                    />
                    <FeatureCard
                        icon={CheckCircleIcon}
                        title="Evidence-Based"
                        description="Our recommendations are based on the latest medical research and clinical guidelines."
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 text-center bg-white dark:bg-slate-950">
                <div className="max-w-3xl mx-auto space-y-8">
                    {getToken() ? (
                        <>
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-sans tracking-tight">Welcome Back to <span className="text-blue-600 dark:text-blue-400 font-sans">MiniMedi</span></h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 font-sans">Your health is our priority. Ready for a quick health check-up today?</p>
                            <Link to="/ai-checker" className="inline-flex items-center gap-2 bg-black dark:bg-white dark:text-black text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl">
                                Go to AI Checker
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </Link>
                        </>
                    ) : (
                        <>
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Ready to Check Your Health?</h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400">Start your free health assessment today and get instant AI-powered insights</p>
                            <Link to="/signup" className="inline-flex items-center gap-2 bg-black dark:bg-white dark:text-black text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all">
                                Get Started Free
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </Link>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
