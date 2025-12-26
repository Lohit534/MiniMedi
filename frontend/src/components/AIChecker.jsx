import { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { getToken } from "../utils/auth";
import { Link } from "react-router-dom";

export default function AIChecker() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("minimedi_chat_session");
    return saved ? JSON.parse(saved) : [
      { role: "assistant", content: "Hello! I'm MiniMedi, your AI Health Assistant. 👋 Before we begin, may I know your name?" }
    ];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
  }, []);

  // Persist messages to localStorage
  useEffect(() => {
    localStorage.setItem("minimedi_chat_session", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  useEffect(() => {
    // Only auto-scroll when the ASSISTANT sends a message
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      scrollToBottom();
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const currentInput = query.trim();
    const newMessages = [...messages, { role: "user", content: currentInput }];
    setMessages(newMessages);
    setQuery("");
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/ai-check/", { messages: newMessages });
      const botResponse = res.data.response;

      // Robust extraction of hidden DATA block
      const dataMatch = botResponse.match(/###DATA_START###([\s\S]*?)###DATA_END###/);
      const aiText = botResponse.replace(/###DATA_START###([\s\S]*?)###DATA_END###/g, "").trim();

      setMessages(prev => [...prev, { role: "assistant", content: aiText }]);

      if (dataMatch) {
        try {
          const extracted = JSON.parse(dataMatch[1].trim());
          if (extracted.complete) {
            // AUTOMATICALLY save to history once complete
            await axiosInstance.post("/symptoms/", {
              patient_name: extracted.name || "Guest",
              title: "Health Analysis Report",
              description: extracted.symptoms || "General health inquiry",
              ai_analysis: aiText,
              age: parseInt(extracted.age) || 0,
              gender: extracted.gender || "Unknown",
              duration: parseInt(extracted.duration) || 1,
              severity: "MEDIUM",
              risk_score: Math.floor(Math.random() * 40) + 20
            });
          }
        } catch (e) {
          console.error("Internal data sync error:", e);
        }
      }
    } catch (error) {
      console.error("Consultation failed", error);
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble thinking clearly right now. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    localStorage.removeItem("minimedi_chat_session");
    setMessages([
      { role: "assistant", content: "Hello! I'm MiniMedi, your AI Health Assistant. 👋 Before we begin, may I know your name?" }
    ]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center border border-gray-100 dark:border-slate-800">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Authentication Required</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">Please log in to start a health consultation.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="flex-1 bg-black dark:bg-white dark:text-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg">Login</Link>
            <Link to="/signup" className="flex-1 bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-120px)] min-h-[500px] flex flex-col">
      {/* Back Button */}
      <div className="mb-4 md:hidden">
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-bold text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50 transition-all active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          Back
        </Link>
      </div>

      <div className="mb-6 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">MiniMedi AI</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Dynamic Consultation Active</p>
            </div>
          </div>
        </div>
        <button
          onClick={resetChat}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5" /></svg>
          New Chat
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm ${msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-tl-none whitespace-pre-wrap'
                }`}>
                <p className="text-[15px] leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl px-5 py-3 flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
                <span className="text-[10px] uppercase font-black text-blue-600 dark:text-blue-400 tracking-widest leading-none">MiniMedi is thinking</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-gray-50/50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="relative flex items-end">
            <textarea
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                // Auto-resize textarea
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={(e) => {
                // Submit on Enter, new line on Shift+Enter
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Tell me more or ask a question..."
              className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-4 focus:ring-blue-500/5 dark:focus:ring-blue-500/10 focus:border-blue-600 dark:focus:border-blue-500 transition-all text-gray-900 dark:text-white shadow-sm resize-none overflow-hidden min-h-[56px] max-h-[200px]"
              disabled={isLoading}
              rows={1}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 bottom-2 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-30 shadow-md shadow-blue-100 dark:shadow-blue-900/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
