import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-gray-400 py-16 px-6 border-t border-slate-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {/* Brand */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                                <path d="M11.25 4.75a1.25 1.25 0 0 0-2.5 0v3.5a1.25 1.25 0 0 0 2.5 0v-3.5ZM13.75 4.75a1.25 1.25 0 0 1 2.5 0v3.5a1.25 1.25 0 0 1-2.5 0v-3.5Z" />
                                <path fillRule="evenodd" d="M12.5 2.5a2.75 2.75 0 0 0-2.75 2.25H9.5A2.75 2.75 0 0 0 6.75 7.5v.75a6.75 6.75 0 0 0 10.5 5.618V18.15a2.1 2.1 0 0 1-1.528 1.996.75.75 0 0 0-.203 1.487A3.6 3.6 0 0 0 19.1 18.15V13.5a.75.75 0 0 0-1.5 0v4.65a2.1 2.1 0 0 1-4.2 0v-4.282A6.75 6.75 0 0 0 18.25 8.25V7.5A2.75 2.75 0 0 0 15.5 4.75h-.25A2.75 2.75 0 0 0 12.5 2.5Zm-2.75 5a1.25 1.25 0 0 1 1.25-1.25h3a1.25 1.25 0 0 1 1.25 1.25v.75a2.75 2.75 0 0 1-5.5 0v-.75Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="font-bold text-xl">MiniMedi</span>
                    </div>
                    <p className="text-sm leading-relaxed max-w-xs">
                        Your trusted AI-powered health assistant providing instant health insights and personalized recommendations.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-semibold mb-6">Quick Links</h3>
                    <ul className="space-y-4 text-sm">
                        <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                        <li><Link to="/ai-checker" className="hover:text-blue-400 transition-colors">AI Checker</Link></li>
                        <li><Link to="/chat" className="hover:text-blue-400 transition-colors">AI Chat</Link></li>
                        <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                        <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h3 className="text-white font-semibold mb-6">Resources</h3>
                    <ul className="space-y-4 text-sm">
                        <li><Link to="/articles" className="hover:text-blue-400 transition-colors">Health Articles</Link></li>
                        <li><Link to="/faqs" className="hover:text-blue-400 transition-colors">FAQs</Link></li>
                        <li><Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                        <li><Link to="/support" className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
                        <li><Link to="/disclaimer" className="hover:text-blue-400 transition-colors">Medical Disclaimer</Link></li>
                    </ul>
                </div>

                {/* Contact Us */}
                <div>
                    <h3 className="text-white font-semibold mb-6">Contact Us</h3>
                    <ul className="space-y-4 text-sm">
                        <li className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            lohithpeyyala@gmail.com
                        </li>
                        <li className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            1-800-HEALTH-AI
                        </li>
                        <li className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1"><path d="M20 10c0 6-8 10-8 10s-8-4-8-10 6-10 8-10 8 4 8 10" /><circle cx="12" cy="10" r="3" /></svg>
                            <span>123 Health Street, Medical City, HC 12345</span>
                        </li>
                    </ul>
                    <div className="flex gap-4 mt-6">
                        {/* Instagram */}
                        <a
                            href="https://www.instagram.com/lohithchocolate?igsh=MWsyMmJob2Vwb2Zl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer"
                            aria-label="Instagram"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                        </a>
                        {/* LinkedIn */}
                        <a
                            href="https://www.linkedin.com/in/peyyala-lohit-a2ba16265"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer"
                            aria-label="LinkedIn"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                        </a>
                        {/* GitHub */}
                        <a
                            href="https://github.com/Lohit534"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer"
                            aria-label="GitHub"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-center text-sm">
                <p className="mb-2">&copy; {new Date().getFullYear()} MiniMedi. All rights reserved.</p>
                <p className="text-yellow-500 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    For informational purposes only. Not a substitute for professional medical advice.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
