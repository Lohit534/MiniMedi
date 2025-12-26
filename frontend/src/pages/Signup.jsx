import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { setToken } from "../utils/auth";
import { useGoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      // Ensure username is not empty for the backend
      const effectiveUsername = username || email.split('@')[0] || email;
      const response = await axiosInstance.post("/users/signup/", {
        name,
        username: effectiveUsername,
        email,
        password
      });

      const data = response.data;
      if (data.token) {
        setToken(data.token);
        toast.success("Signed up successfully!");
        navigate("/");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Signup failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axiosInstance.post("/users/google-login/", {
          token: tokenResponse.access_token,
        });
        if (res.data.token) {
          setToken(res.data.token);
          toast.success("Signup with Google successful!");
          navigate("/");
        }
      } catch (error) {
        toast.error("Google signup failed.");
      }
    },
    onError: () => toast.error("Google Login Failed"),
  });

  const handleSocialLogin = (platform) => {
    if (platform === "Google") {
      googleLogin();
    } else {
      toast.info(`${platform} login is coming soon!`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-start justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-500 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gray-50 dark:bg-slate-900/10 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-50 dark:bg-slate-900/10 rounded-full blur-[100px] opacity-60" />
      </div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Back Button - Enhanced Visibility */}
        <Link
          to="/"
          className="absolute -top-12 left-0 hidden max-md:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm text-[13px] font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all group outline-none"
        >
          <div className="p-0.5 rounded-full bg-gray-100 dark:bg-slate-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </div>
          Back
        </Link>

        {/* Form Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-100 dark:border-slate-800 rounded-3xl p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-6">
            <span className="block text-3xl font-black text-black dark:text-white tracking-tighter mb-0.5">MiniMedi</span>
            <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 tracking-tight">
              Create Account
            </h2>
          </div>

          <form className="space-y-3.5" onSubmit={handleSignup}>
            <div className="space-y-3">
              <div>
                <label htmlFor="full-name" className="block text-[12px] font-bold text-gray-600 dark:text-gray-400 mb-1.5 ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="full-name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-2.5 pl-10 border-2 border-gray-100 dark:border-slate-800 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:border-black dark:focus:border-white sm:text-sm bg-gray-50/50 dark:bg-slate-950/50 transition-all font-medium"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email-address" className="block text-[12px] font-bold text-gray-600 dark:text-gray-400 mb-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-2.5 pl-10 border-2 border-gray-100 dark:border-slate-800 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:border-black dark:focus:border-white sm:text-sm bg-gray-50/50 dark:bg-slate-950/50 transition-all font-medium"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <input type="hidden" value={username} name="username" />

              <div>
                <label htmlFor="password" className="block text-[12px] font-bold text-gray-600 dark:text-gray-400 mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-2.5 pl-10 pr-14 border-2 border-gray-100 dark:border-slate-800 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:border-black dark:focus:border-white sm:text-sm bg-gray-50/50 dark:bg-slate-950/50 transition-all font-mono"
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[11px] font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors z-20"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Requirements Grid */}
                <div className="mt-2 p-2 rounded-xl bg-gray-50/50 dark:bg-slate-950/50 border border-gray-100 dark:border-slate-800">
                  <p className="text-[9px] uppercase tracking-widest font-extrabold text-gray-400 dark:text-gray-500 mb-1.5 ml-1">Security Score</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className={`flex items-center gap-1.5 px-1.5 py-1 rounded-lg transition-all ${password.length >= 6 ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}`}>
                      <div className={`w-1 h-1 rounded-full ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
                      <span className="text-[9px] font-bold">6+ Chars</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-1.5 py-1 rounded-lg transition-all ${/[A-Z]/.test(password) ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}`}>
                      <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
                      <span className="text-[9px] font-bold">Uppercase</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-1.5 py-1 rounded-lg transition-all ${/[0-9]/.test(password) ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}`}>
                      <div className={`w-1 h-1 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
                      <span className="text-[9px] font-bold">Number</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-1.5 py-1 rounded-lg transition-all ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'}`}>
                      <div className={`w-1 h-1 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
                      <span className="text-[9px] font-bold">Symbol</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-[12px] font-bold text-gray-600 dark:text-gray-400 mb-1.5 ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-2.5 pl-10 pr-14 border-2 border-gray-100 dark:border-slate-800 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:border-black dark:focus:border-white sm:text-sm bg-gray-50/50 dark:bg-slate-950/50 transition-all font-mono"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[11px] font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors z-20"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center px-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-3.5 w-3.5 text-black dark:text-white bg-gray-100 dark:bg-slate-950 border-gray-200 dark:border-slate-800 rounded focus:ring-black dark:focus:ring-white cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 block text-[11px] text-gray-500 dark:text-gray-500 font-bold cursor-pointer uppercase tracking-tight">
                I agree to <span className="text-black dark:text-white font-bold hover:underline">Terms</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white dark:text-black bg-black dark:bg-white hover:bg-gray-900 dark:hover:bg-gray-100 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_20px_-5px_rgba(255,255,255,0.05)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : "Create Account"}
            </button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-3 bg-white dark:bg-slate-950 text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[9px]">Or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              className="w-full inline-flex justify-center items-center py-2.5 px-4 border-2 border-gray-100 dark:border-slate-800 rounded-xl shadow-sm bg-white dark:bg-slate-900 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all transform hover:-translate-y-0.5"
            >
              <svg className="h-4 w-4 mr-2.5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
              </svg>
              Sign up with Google
            </button>
          </form>

          <p className="text-center mt-6 text-[12px] text-gray-500 dark:text-gray-400 font-medium tracking-tight">
            Account exists?{" "}
            <Link to="/login" className="font-bold text-black dark:text-white hover:opacity-70 transition-opacity">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
