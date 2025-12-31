import axios from "axios";
import { getToken, removeToken } from "../utils/auth";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Get the request URL to check if it's an auth endpoint
    const requestUrl = error.config?.url || '';
    const isAuthEndpoint = requestUrl.includes('/login') || requestUrl.includes('/signup') || requestUrl.includes('/google-login');

    // Check if error is due to expired/invalid token (401 or 403)
    // Skip auto-logout for auth endpoints (login/signup pages handle their own errors)
    if (!isAuthEndpoint && error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Check if error message indicates token expiration
      const errorMessage = error.response.data?.error || '';
      if (errorMessage.includes('token') || errorMessage.includes('expired') || errorMessage.includes('Invalid')) {
        // Auto-logout: Clear token and redirect to login
        removeToken();
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
