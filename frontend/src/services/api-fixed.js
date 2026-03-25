import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with proper configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: false, // We'll handle auth via headers
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle CORS errors specifically
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      console.error('CORS/Network error detected. Check backend CORS configuration.');
      error.message = 'Network error. Please ensure backend server is running and CORS is properly configured.';
    }
    
    // Handle auth errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.role - User role (optional)
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: error.message };
    }
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: error.message };
    }
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: error.message };
    }
  }
};

// Tasks API
export const tasksAPI = {
  /**
   * Get all tasks for a project
   * @param {string} projectId - Project ID
   */
  getTasks: async (projectId) => {
    try {
      const response = await apiClient.get(`/tasks/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: error.message };
    }
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   */
  createTask: async (taskData) => {
    try {
      const response = await apiClient.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: error.message };
    }
  },

  /**
   * Update a task
   * @param {string} taskId - Task ID
   * @param {Object} updateData - Update data
   */
  updateTask: async (taskId, updateData) => {
    try {
      const response = await apiClient.put(`/tasks/${taskId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: error.message };
    }
  },

  /**
   * Delete a task
   * @param {string} taskId - Task ID
   */
  deleteTask: async (taskId) => {
    try {
      const response = await apiClient.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: error.message };
    }
  }
};

export default apiClient;
