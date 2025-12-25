import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import History from "./pages/History";
import AIChecker from "./components/AIChecker";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import MiniChatbot from "./components/MiniChatbot";
import { getToken } from "./utils/auth";

const Layout = ({ theme, toggleTheme, isChatbotOpen, setIsChatbotOpen }) => {
  const location = useLocation();
  const token = getToken();

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300 dark:bg-slate-950">
      <Navbar theme={theme} toggleTheme={toggleTheme} token={token} />
      <main className="flex-grow pt-[72px]">
        <Routes>
          <Route path="/" element={<HomePage setIsChatbotOpen={setIsChatbotOpen} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/history" element={<History />} />
          <Route path="/ai-checker" element={<AIChecker />} />
        </Routes>
      </main>
      <Footer />
      {token && <MiniChatbot isOpen={isChatbotOpen} setIsOpen={setIsChatbotOpen} />}
    </div>
  );
};

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Layout
        theme={theme}
        toggleTheme={toggleTheme}
        isChatbotOpen={isChatbotOpen}
        setIsChatbotOpen={setIsChatbotOpen}
      />
    </Router>
  );
};

export default App;
