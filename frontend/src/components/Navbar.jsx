import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getToken, removeToken } from "../utils/auth";
import axiosInstance from "../api/axiosInstance";
import "../index.css";

const Navbar = ({ theme, toggleTheme, token }) => {
  const [username, setUsername] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axiosInstance.get("/users/profile/")
        .then((res) => {
          const data = res.data;
          setUsername(data.name || data.username);
        })
        .catch(() => {
          // toast.error("Failed to load user data.");
        });
    }
  }, [token]);

  const handleLogout = () => {
    toast.info("You have been logged out.");
    removeToken();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="border-b border-gray-100 dark:border-slate-800 py-4 px-6 fixed w-full top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center flex-shrink-0 gap-3">
              {/* Stethoscope Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 2v2" />
                  <path d="M5 2v2" />
                  <path d="M5 3a4 4 0 0 0 0 8h6a4 4 0 0 0 0-8" />
                  <path d="M12 11v5a4 4 0 0 0 8 0v-1a2 2 0 1 0-4 0v1" />
                </svg>
              </div>
              <span className="font-bold text-xl leading-none dark:text-white">MiniMedi</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl leading-none dark:text-white">MiniMedi</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Your Health Companion</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-medium text-gray-700 dark:text-gray-300">
            <Link to="/" className="text-black bg-black dark:bg-white dark:text-black text-white px-4 py-1.5 rounded-full text-sm">Home</Link>
            {token && (
              <>
                <Link to="/ai-checker" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Checker</Link>
                <Link to="/history" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">History</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              )}
            </button>

            {token ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="font-medium text-gray-600 dark:text-gray-300">Hi, {username}</span>
                <button onClick={handleLogout} className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer dark:text-gray-200">Logout</button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="font-medium hover:text-blue-600 dark:hover:text-blue-400 dark:text-gray-200 transition-colors">Login</Link>
                <Link to="/signup" className="bg-black dark:bg-white dark:text-black text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">Sign Up</Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-gray-900 dark:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay (Half-Page Drawer) */}
      <div className={`fixed inset-y-0 right-0 z-[60] w-[70%] sm:w-[50%] bg-[#020617] border-l border-white/10 shadow-2xl transition-all duration-500 ease-in-out transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-0 right-0 w-full h-[60%] bg-blue-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-full h-[60%] bg-purple-600/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative h-full flex flex-col z-10 p-6">
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center mb-12">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
            >
              MiniMedi
            </Link>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-white/70 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className="flex-1 flex flex-col gap-8 justify-center px-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-4xl font-bold text-white/50 hover:text-white transition-all hover:translate-x-2"
            >
              Home
            </Link>

            {token && (
              <>
                <Link
                  to="/ai-checker"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-4xl font-bold text-white/50 hover:text-white transition-all hover:translate-x-2"
                >
                  AI Checker
                </Link>

                <Link
                  to="/history"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 transition-all hover:scale-105"
                >
                  History
                </Link>
              </>
            )}
          </div>

          {/* User Section / Footer */}
          <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-8">
            {token ? (
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/20 text-blue-400 font-bold">
                    {username ? username[0].toUpperCase() : "U"}
                  </div>
                  <span className="text-white/80 font-medium">Hi, {username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-400 font-bold text-xs uppercase tracking-widest hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="py-4 text-center rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm">Login</Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="py-4 text-center rounded-2xl bg-blue-600 text-white font-bold text-sm">Sign Up</Link>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-6 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Privacy</Link>
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Terms</Link>
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-white transition-colors">Support</Link>
              </div>
              <p className="text-white/20 text-[9px] font-bold uppercase tracking-[0.4em] text-center">
                © 2025 MINIMEDI
              </p>
            </div>
          </div>

        </div>
      </div>


      {/* Backdrop */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-[55] bg-black/80 backdrop-blur-md transition-opacity md:hidden"
        ></div>
      )}
    </>
  );
};

export default Navbar;
