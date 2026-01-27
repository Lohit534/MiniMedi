import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

const MiniChatbot = ({ isOpen, setIsOpen }) => {
    const initialMessages = [
        { id: 1, text: "Hello! How can I help you today?", sender: 'ai' }
    ];
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [showReport, setShowReport] = useState(false);

    // Report Form State
    const [reportStep, setReportStep] = useState('select'); // 'select' | 'form'
    const [selectedSubject, setSelectedSubject] = useState('');
    const [reportData, setReportData] = useState({ email: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reportIssues = [
        { label: "Chatbot Not Working", subject: "Chatbot Not Working" },
        { label: "Server Connection Error", subject: "Server Connection Error" },
        { label: "UI/Display Issue", subject: "UI/Display Issue" },
        { label: "Other Issue", subject: "General Issue" }
    ];

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
        setReportStep('form');
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axiosInstance.post('/users/report-issue/', {
                subject: selectedSubject,
                email: reportData.email,
                description: reportData.description,
                userAgent: navigator.userAgent
            });
            toast.success("Report sent successfully!");
            setShowReport(false);
            setReportStep('select');
            setReportData({ email: '', description: '' });
        } catch (error) {
            console.error(error);
            toast.error("Failed to send report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setMessages(initialMessages);
            setShowReport(false);
        }
    }, [isOpen]);

    const sendMessage = (text) => {
        const newUserMessage = { id: Date.now(), text, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: `I'm a mini assistant. Regarding "${text}", for a comprehensive medical report and risk score, please use our full AI Checker.`,
                sender: 'ai',
                link: true
            }]);
        }, 1000);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 h-[450px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-blue-600 dark:bg-blue-700 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">MiniMedi Assistant</h3>
                                <p className="text-[10px] text-blue-100 italic">Always here to help</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowReport(!showReport)}
                                title="Report an Issue"
                                className={`p-1.5 rounded-lg transition-colors ${showReport ? 'bg-white text-blue-600' : 'bg-blue-500/50 hover:bg-blue-500 text-white'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            </button>
                            <Link
                                to="/ai-checker"
                                onClick={() => setIsOpen(false)}
                                className="text-[10px] font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg border border-white/20 transition-all flex items-center gap-1.5"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></svg>
                                Full Assessment
                            </Link>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 dark:hover:bg-blue-800 p-1 rounded-lg transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                    </div>

                    {showReport ? (
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 dark:bg-slate-950/50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-800">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                                    <svg className="text-red-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                                    Report an Issue
                                </h4>

                                {reportStep === 'select' ? (
                                    <>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                            Please select the type of issue you're experiencing.
                                        </p>
                                        <div className="space-y-2">
                                            {reportIssues.map((issue, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleSubjectSelect(issue.subject)}
                                                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium bg-gray-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex justify-between items-center group border border-transparent hover:border-blue-100 dark:hover:border-blue-800/50"
                                                >
                                                    {issue.label}
                                                    <svg className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <form onSubmit={handleReportSubmit} className="space-y-3">
                                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg mb-2">
                                            Topic: {selectedSubject}
                                        </div>
                                        <div>
                                            <input
                                                type="email"
                                                required
                                                placeholder="Your Email"
                                                value={reportData.email}
                                                onChange={(e) => setReportData({ ...reportData, email: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            />
                                        </div>
                                        <div>
                                            <textarea
                                                required
                                                rows="4"
                                                placeholder="Describe the issue..."
                                                value={reportData.description}
                                                onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                                            ></textarea>
                                        </div>
                                        <div className="flex gap-2 pt-1">
                                            <button
                                                type="button"
                                                onClick={() => setReportStep('select')}
                                                className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex-[2] py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? 'Sending...' : 'Send Report'}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                <button
                                    onClick={() => { setShowReport(false); setReportStep('select'); }}
                                    className="mt-4 w-full py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border-t border-gray-100 dark:border-slate-800 pt-3"
                                >
                                    Cancel & Return to Chat
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-slate-950/50">
                                {messages.map((m) => (
                                    <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                                            : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-slate-700 shadow-sm'
                                            }`}>
                                            {m.text}
                                            {m.link && (
                                                <Link
                                                    to="/ai-checker"
                                                    onClick={() => setIsOpen(false)}
                                                    className="block mt-2 text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                                                >
                                                    Open AI Checker
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Direct Report option */}
                            {messages.length === 1 && (
                                <div className="px-4 pb-2 animate-in fade-in duration-500">
                                    <button
                                        onClick={() => setShowReport(true)}
                                        className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                                        Report an Issue
                                    </button>
                                </div>
                            )}

                            {/* Input Area */}
                            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                                <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen ? 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 rotate-90' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-110 active:scale-95'
                    }`}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2-2z"></path></svg>
                )}
            </button>
        </div>
    );
};

export default MiniChatbot;
