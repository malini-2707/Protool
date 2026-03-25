import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
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
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Kanban Board API Service
 * Handles all task-related API calls
 */
export const kanbanService = {
  /**
   * Fetch all tasks for a specific project
   * @param {string} projectId - The project ID
   * @returns {Promise} Axios response with tasks data
   */
  getTasks: async (projectId) => {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    
    try {
      const response = await apiClient.get(`/tasks/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get a specific task by ID
   * @param {string} taskId - The task ID
   * @returns {Promise} Axios response with task data
   */
  getTaskById: async (taskId) => {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    
    try {
      const response = await apiClient.get(`/tasks/task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @param {string} taskData.title - Task title
   * @param {string} taskData.description - Task description (optional)
   * @param {string} taskData.projectId - Project ID
   * @returns {Promise} Axios response with created task
   */
  createTask: async (taskData) => {
    const { title, description, projectId } = taskData;
    
    if (!title || !projectId) {
      throw new Error('Title and Project ID are required');
    }
    
    try {
      const response = await apiClient.post('/tasks', {
        title: title.trim(),
        description: description?.trim() || null,
        projectId
      });
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Update task status (or other properties)
   * @param {string} taskId - The task ID
   * @param {Object} updateData - Data to update
   * @param {string} updateData.status - New task status
   * @param {string} updateData.title - Updated title (optional)
   * @param {string} updateData.description - Updated description (optional)
   * @returns {Promise} Axios response with updated task
   */
  updateTask: async (taskId, updateData) => {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    
    try {
      const response = await apiClient.put(`/tasks/${taskId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Update only task status (convenience method)
   * @param {string} taskId - The task ID
   * @param {string} status - New status (TODO, IN_PROGRESS, DONE)
   * @returns {Promise} Axios response with updated task
   */
  updateTaskStatus: async (taskId, status) => {
    if (!taskId || !status) {
      throw new Error('Task ID and status are required');
    }
    
    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status. Must be TODO, IN_PROGRESS, or DONE');
    }
    
    return this.updateTask(taskId, { status });
  },

  /**
   * Delete a task
   * @param {string} taskId - The task ID
   * @returns {Promise} Axios response
   */
  deleteTask: async (taskId) => {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    
    try {
      const response = await apiClient.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error.response?.data || error;
    }
  }
};

export default kanbanService;
