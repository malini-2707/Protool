import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create simple axios instance for auth
const authAPI = axios.create({
  baseURL: 'http://localhost:5000/api',
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setError('');
      setLoading(true);
      
      console.log('📝 Registering user:', userData);
      
      const response = await authAPI.post('/auth/register', userData);
      
      console.log('✅ Registration successful:', response.data);
      
      if (response.data.success) {
        const { data, token: responseToken } = response.data;
        
        setUser(data);
        setToken(responseToken);
        localStorage.setItem('token', responseToken);
        localStorage.setItem('user', JSON.stringify(data));
        
        return { success: true };
      } else {
        throw new Error(response.data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('❌ Registration error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setError('');
      setLoading(true);
      
      console.log('🔐 Logging in user:', credentials);
      
      const response = await authAPI.post('/auth/login', credentials);
      
      console.log('✅ Login successful:', response.data);
      
      if (response.data.success) {
        const { data, token: responseToken } = response.data;
        
        setUser(data);
        setToken(responseToken);
        localStorage.setItem('token', responseToken);
        localStorage.setItem('user', JSON.stringify(data));
        
        return { success: true };
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    console.log('🚪 Logging out user');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setError('');
  };

  // Get user profile
  const getProfile = async () => {
    try {
      const response = await authAPI.get('/auth/profile');
      return response.data;
    } catch (err) {
      console.error('❌ Profile error:', err);
      return null;
    }
  };

  const value = {
    user,
    token,
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
