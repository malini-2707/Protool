import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create axios instance for auth
const authAPI = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser && storedUser !== 'undefined' && storedToken !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        // Corrupted data — clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      // Clear any stale/invalid values
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authAPI.post('/auth/register', userData);

      if (response.data.success) {
        const { data, token: responseToken } = response.data;

        setUser(data);
        setToken(responseToken);
        setIsAuthenticated(true);
        localStorage.setItem('token', responseToken);
        localStorage.setItem('user', JSON.stringify(data));

        return { success: true };
      } else {
        throw new Error(response.data.error || 'Registration failed');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (err.response?.status === 409
          ? "User already exists. Please login."
          : err.message);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authAPI.post('/auth/login', credentials);

      if (response.data.success) {
        const { data, token: responseToken } = response.data;

        setUser(data);
        setToken(responseToken);
        setIsAuthenticated(true);
        localStorage.setItem('token', responseToken);
        localStorage.setItem('user', JSON.stringify(data));

        return { success: true };
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (err.response?.status === 401
          ? "Invalid email or password"
          : err.message);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setError(null);
  };

  // Get user profile
  const getProfile = async () => {
    try {
      const response = await authAPI.get('/auth/profile');
      return response.data;
    } catch (err) {
      console.error('Profile error:', err);
      return null;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    getProfile,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
