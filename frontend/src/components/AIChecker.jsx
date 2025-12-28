import { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { getToken } from "../utils/auth";
import { Link } from "react-router-dom";

// Simple markdown-like text formatter
const formatMessage = (text) => {
  if (!text) return "";

  // Split into lines and process
  const lines = text.split('\n');
  const formatted = [];
  let inList = false;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Headers
    if (trimmed.startsWith('###')) {
      formatted.push(<h3 key={idx} className="text-lg font-bold mt-4 mb-2 text-gray-900 dark:text-white">{trimmed.replace(/^###\s*/, '')}</h3>);
    } else if (trimmed.startsWith('##')) {
      formatted.push(<h2 key={idx} className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">{trimmed.replace(/^##\s*/, '')}</h2>);
    } else if (trimmed.startsWith('#')) {
      formatted.push(<h1 key={idx} className="text-2xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">{trimmed.replace(/^#\s*/, '')}</h1>);
    }
    // Bullet points
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) {
        inList = true;
      }
      formatted.push(
        <div key={idx} className="flex gap-2 my-1">
          <span className="text-blue-500 font-bold">•</span>
          <span>{trimmed.substring(2)}</span>
        </div>
      );
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s(.+)$/);
      if (match) {
        formatted.push(
          <div key={idx} className="flex gap-2 my-1">
            <span className="text-blue-500 font-bold">{match[1]}.</span>
            <span>{match[2]}</span>
          </div>
        );
      }
    }
    // Bold text
    else if (trimmed.includes('**')) {
      const parts = trimmed.split('**');
      formatted.push(
        <p key={idx} className="my-2">
          {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part)}
        </p>
      );
    }
    // Regular paragraph
    else if (trimmed) {
      inList = false;
      formatted.push(<p key={idx} className="my-2">{line}</p>);
    }
    // Empty line
    else {
      inList = false;
      formatted.push(<div key={idx} className="h-2" />);
    }
  });

  return <div className="space-y-1">{formatted}</div>;
};

// Copy button component
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
      title="Copy message"
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      )}
    </button>
  );
};

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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

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

  // Detect scroll position to show/hide scroll button
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      // Show button if NOT at bottom (threshold: 50px from bottom)
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShowScrollButton(!isAtBottom);
    };

    // Check initial scroll position after content loads
    const initialCheck = setTimeout(() => {
      handleScroll();
    }, 200);

    chatContainer.addEventListener('scroll', handleScroll);

    // Also check when messages change (user might be at bottom)
    handleScroll();

    return () => {
      clearTimeout(initialCheck);
      chatContainer.removeEventListener('scroll', handleScroll);
    };
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

      // Auto-save or update on EVERY AI response (not just when complete)
      if (dataMatch) {
        try {
          const extracted = JSON.parse(dataMatch[1].trim());
          const savedRecordId = localStorage.getItem('minimedi_saved_record_id');

          // Check if we already have a saved record for this conversation
          if (savedRecordId) {
            // UPDATE existing record with latest conversation
            const conversationSummary = [...messages, { role: "assistant", content: aiText }]
              .filter(msg => msg.role === 'assistant')
              .map(msg => msg.content)
              .join('\n\n');

            await axiosInstance.patch(`/symptoms/${savedRecordId}/`, {
              ai_analysis: conversationSummary,
              // Update other fields if available
              ...(extracted.name && { patient_name: extracted.name }),
              ...(extracted.age && { age: parseInt(extracted.age) }),
              ...(extracted.gender && { gender: extracted.gender }),
              ...(extracted.symptoms && { description: extracted.symptoms }),
              ...(extracted.duration && { duration: parseInt(extracted.duration) })
            });
          } else {
            // CREATE new record (first save)
            const response = await axiosInstance.post("/symptoms/", {
              patient_name: extracted.name || "Guest",
              title: "Health Analysis Report",
              description: extracted.symptoms || "In progress...",
              ai_analysis: aiText,
              age: parseInt(extracted.age) || 0,
              gender: extracted.gender || "Unknown",
              duration: parseInt(extracted.duration) || 1,
              severity: "MEDIUM",
              risk_score: Math.floor(Math.random() * 40) + 20
            });

            // Store record ID for future updates
            if (response.data && response.data.id) {
              localStorage.setItem('minimedi_saved_record_id', response.data.id.toString());
            }
          }
        } catch (e) {
          console.error("Auto-save/update error:", e);
        }
      }
    } catch (error) {
      console.error("Consultation failed", error);
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble thinking clearly right now. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = async () => {
    // Update the saved record with full conversation before resetting
    const savedRecordId = localStorage.getItem('minimedi_saved_record_id');
    if (savedRecordId) {
      try {
        // Create a summary of the entire conversation
        const conversationSummary = messages
          .filter(msg => msg.role === 'assistant')
          .map(msg => msg.content)
          .join('\n\n');

        // Update the existing record with full conversation
        await axiosInstance.patch(`/symptoms/${savedRecordId}/`, {
          ai_analysis: conversationSummary
        });

        // Clear the saved record ID
        localStorage.removeItem('minimedi_saved_record_id');
      } catch (e) {
        console.error("Failed to update conversation history:", e);
      }
    }

    // Reset the chat
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
    <div className="max-w-7xl mx-auto px-0 md:px-4 py-0 md:py-4 h-[calc(100vh-72px)] flex flex-col">
      {/* Back Button */}
      <div className="mb-3 md:mb-4 px-4 md:px-0 md:hidden">
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full text-sm font-bold text-gray-600 dark:text-gray-400 shadow-sm border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          Back
        </Link>
      </div>

      <div className="mb-3 md:mb-6 mx-4 md:mx-0 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white dark:from-slate-900 dark:to-slate-900/80 backdrop-blur-md p-3 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-blue-100 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">MiniMedi AI</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Online</p>
            </div>
          </div>
        </div>
        <button
          onClick={resetChat}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 transition-all border border-blue-100 dark:border-slate-700 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg>
          New Chat
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-none md:rounded-3xl shadow-xl border-t border-b md:border border-gray-100 dark:border-slate-800 flex flex-col overflow-hidden min-h-0 relative">
        <div ref={chatContainerRef} className="flex-1 p-3 md:p-6 overflow-y-auto space-y-4 md:space-y-6 scrollbar-hide">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`group relative max-w-[85%] ${msg.role === 'user' ? '' : 'w-full max-w-full'}`}>
                <div className={`rounded-2xl px-5 py-4 shadow-sm ${msg.role === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm ml-auto'
                  : 'bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                  }`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></svg>
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">MiniMedi AI</span>
                      </div>
                      <CopyButton text={msg.content} />
                    </div>
                  )}
                  <div className={`text-[15px] leading-relaxed ${msg.role === 'user' ? 'font-medium' : ''}`}>
                    {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">MiniMedi is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to Bottom Button - ChatGPT Style */}
        {showScrollButton && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40">
            <button
              onClick={scrollToBottom}
              className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded-full shadow-lg border border-gray-300 transition-all duration-200 hover:scale-110"
              title="Scroll to bottom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 15-6 6-6-6" />
              </svg>
            </button>
          </div>
        )}

        <div className="p-3 md:p-6 bg-gray-50/50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800">
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
              placeholder="Type your message..."
              className="w-full bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl px-4 md:px-6 py-3 md:py-4 pr-14 md:pr-16 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all text-gray-900 dark:text-white shadow-sm resize-none overflow-hidden min-h-[52px] md:min-h-[56px] max-h-[200px]"
              disabled={isLoading}
              rows={1}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 bottom-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white p-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-blue-200 dark:shadow-blue-900/20 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
