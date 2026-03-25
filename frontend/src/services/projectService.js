import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with proper configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: false,
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
    // Handle auth errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Project API Service
 * Handles all project-related API calls
 */
export const projectService = {
  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @param {string} projectData.title - Project title (required)
   * @param {string} projectData.description - Project description (optional)
   * @param {string} projectData.startDate - Start date (optional)
   * @param {string} projectData.endDate - End date (optional)
   * @param {string[]} projectData.features - Array of features (optional)
   * @returns {Promise} Axios response
   */
  createProject: async (projectData) => {
    try {
      const response = await apiClient.post('/projects', projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: error.message };
    }
  },

  /**
   * Get all projects for the logged-in user
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @returns {Promise} Axios response
   */
  getUserProjects: async (params = {}) => {
    try {
      const response = await apiClient.get('/projects', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: error.message };
    }
  },

  /**
   * Get a specific project by ID
   * @param {string} projectId - Project ID
   * @returns {Promise} Axios response
   */
  getProjectById: async (projectId) => {
    try {
      const response = await apiClient.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: error.message };
    }
  },

  /**
   * Update a project
   * @param {string} projectId - Project ID
   * @param {Object} updateData - Data to update
   * @returns {Promise} Axios response
   */
  updateProject: async (projectId, updateData) => {
    try {
      const response = await apiClient.put(`/projects/${projectId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: error.message };
    }
  },

  /**
   * Delete a project
   * @param {string} projectId - Project ID
   * @returns {Promise} Axios response
   */
  deleteProject: async (projectId) => {
    try {
      const response = await apiClient.delete(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: error.message };
    }
  }
};

export default apiClient;
