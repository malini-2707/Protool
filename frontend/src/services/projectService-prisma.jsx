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
    console.log('🌐 API Request:', config.method?.toUpperCase(), config.url);
    console.log('📤 Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('🌐 Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('🌐 API Response:', response.status, response.config.url);
    console.log('📥 Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('🌐 API Error:', error.response?.status, error.config?.url);
    console.error('📥 Error response:', error.response?.data);
    
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
 * Project API Service - Prisma Version
 * Handles all project-related API calls with proper error handling
 */
export const projectService = {
  /**
   * Create a new project
   * Expected payload format for Prisma:
   * @param {Object} projectData - Project data
   * @param {string} projectData.name - Project name (required)
   * @param {string} projectData.description - Project description (optional)
   * @param {string} projectData.startDate - Start date (optional)
   * @param {string} projectData.endDate - End date (optional)
   * @param {string[]} projectData.features - Array of features (optional)
   * @returns {Promise} Axios response
   */
  createProject: async (projectData) => {
    try {
      console.log('📝 Creating project with Prisma data:', projectData);
      
      // Transform frontend data to match Prisma schema
      const prismaData = {
        name: projectData.title || projectData.name, // Handle both title and name
        description: projectData.description || null,
        features: projectData.features || [],
        startDate: projectData.startDate || null,
        endDate: projectData.endDate || null,
      };

      console.log('🔄 Transformed data for Prisma:', prismaData);
      
      const response = await apiClient.post('/projects', prismaData);
      
      console.log('✅ Project created successfully with Prisma:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create project error:', error);
      
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        
        if (status === 400) {
          // Validation error
          throw {
            success: false,
            error: data.error || 'Validation failed',
            details: data.details || []
          };
        } else if (status === 401) {
          // Authentication error
          throw {
            success: false,
            error: data.error || 'Authentication required'
          };
        } else if (status === 500) {
          // Server error
          throw {
            success: false,
            error: data.error || 'Server error occurred'
          };
        }
      } else if (error.request) {
        // Network error
        throw {
          success: false,
          error: 'Network error. Please check your connection.'
        };
      } else {
        // Other error
        throw {
          success: false,
          error: error.message || 'Failed to create project'
        };
      }
    }
  },

  /**
   * Get all projects for the logged-in user
   * @param {Object} params - Query parameters
   * @returns {Promise} Axios response
   */
  getUserProjects: async (params = {}) => {
    try {
      console.log('📋 Fetching projects with params:', params);
      
      const response = await apiClient.get('/projects', { params });
      
      console.log('✅ Projects fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get projects error:', error);
      
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        
        if (status === 401) {
          // Authentication error
          throw {
            success: false,
            error: data.error || 'Authentication required'
          };
        } else if (status === 500) {
          // Server error
          throw {
            success: false,
            error: data.error || 'Server error occurred'
          };
        }
      } else if (error.request) {
        // Network error
        throw {
          success: false,
          error: 'Network error. Please check your connection.'
        };
      } else {
        // Other error
        throw {
          success: false,
          error: error.message || 'Failed to fetch projects'
        };
      }
    }
  },

  /**
   * Get a specific project by ID
   * @param {string} projectId - Project ID
   * @returns {Promise} Axios response
   */
  getProjectById: async (projectId) => {
    try {
      console.log('🔍 Fetching project:', projectId);
      
      const response = await apiClient.get(`/projects/${projectId}`);
      
      console.log('✅ Project fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get project error:', error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 404) {
          throw {
            success: false,
            error: data.error || 'Project not found'
          };
        } else if (status === 401) {
          throw {
            success: false,
            error: data.error || 'Authentication required'
          };
        }
      }
      
      throw {
        success: false,
        error: error.message || 'Failed to fetch project'
      };
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
      console.log('📝 Updating project:', projectId, updateData);
      
      // Transform data for Prisma if needed
      const prismaUpdateData = {
        ...updateData,
        name: updateData.title || updateData.name, // Handle both title and name
      };
      
      if (prismaUpdateData.title) {
        delete prismaUpdateData.title; // Remove title since we mapped it to name
      }
      
      const response = await apiClient.put(`/projects/${projectId}`, prismaUpdateData);
      
      console.log('✅ Project updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update project error:', error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 404) {
          throw {
            success: false,
            error: data.error || 'Project not found'
          };
        } else if (status === 400) {
          throw {
            success: false,
            error: data.error || 'Validation failed'
          };
        }
      }
      
      throw {
        success: false,
        error: error.message || 'Failed to update project'
      };
    }
  },

  /**
   * Delete a project
   * @param {string} projectId - Project ID
   * @returns {Promise} Axios response
   */
  deleteProject: async (projectId) => {
    try {
      console.log('🗑️ Deleting project:', projectId);
      
      const response = await apiClient.delete(`/projects/${projectId}`);
      
      console.log('✅ Project deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Delete project error:', error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 404) {
          throw {
            success: false,
            error: data.error || 'Project not found'
          };
        }
      }
      
      throw {
        success: false,
        error: error.message || 'Failed to delete project'
      };
    }
  },

  /**
   * Create a new task in a project
   * @param {string} projectId - Project ID
   * @param {Object} taskData - Task payload
   * @returns {Promise} Axios response
   */
  createTask: async (projectId, taskData) => {
    try {
      console.log('📝 Creating task:', projectId, taskData);
      
      const response = await apiClient.post(`/tasks/project/${projectId}`, taskData);
      
      console.log('✅ Task created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create task error:', error);
      
      if (error.response) {
        throw {
          success: false,
          error: error.response.data?.error || error.response.data?.message || 'Failed to create task'
        };
      }
      
      throw {
        success: false,
        error: error.message || 'Failed to create task'
      };
    }
  },

  /**
   * Update an existing task
   * @param {string} taskId - Task ID
   * @param {Object} taskData - Data to update (e.g. status)
   * @returns {Promise} Axios response
   */
  updateTask: async (taskId, taskData) => {
    try {
      console.log('📝 Updating task:', taskId, taskData);
      const response = await apiClient.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('❌ Update task error:', error);
      if (error.response) {
        throw {
          success: false,
          error: error.response.data?.error || error.response.data?.message || 'Failed to update task'
        };
      }
      throw {
        success: false,
        error: error.message || 'Failed to update task'
      };
    }
  }
};

export default apiClient;
