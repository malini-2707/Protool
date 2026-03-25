import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getProject: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  addMember: async (projectId, memberData) => {
    const response = await api.post(`/projects/${projectId}/members`, memberData);
    return response.data;
  },

  removeMember: async (projectId, memberId) => {
    const response = await api.delete(`/projects/${projectId}/members/${memberId}`);
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  getTasks: async (projectId, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/tasks/project/${projectId}?${params}`);
    return response.data;
  },

  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (projectId, taskData) => {
    const response = await api.post(`/tasks/project/${projectId}`, taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  updateTaskOrder: async (tasks) => {
    const response = await api.put('/tasks/order/update', { tasks });
    return response.data;
  },
};

// Sprints API
export const sprintsAPI = {
  getSprints: async (projectId, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/sprints/project/${projectId}?${params}`);
    return response.data;
  },

  getSprint: async (id) => {
    const response = await api.get(`/sprints/${id}`);
    return response.data;
  },

  createSprint: async (projectId, sprintData) => {
    const response = await api.post(`/sprints/project/${projectId}`, sprintData);
    return response.data;
  },

  updateSprint: async (id, sprintData) => {
    const response = await api.put(`/sprints/${id}`, sprintData);
    return response.data;
  },

  deleteSprint: async (id) => {
    const response = await api.delete(`/sprints/${id}`);
    return response.data;
  },

  addTaskToSprint: async (sprintId, taskId) => {
    const response = await api.post(`/sprints/${sprintId}/tasks`, { taskId });
    return response.data;
  },

  removeTaskFromSprint: async (sprintId, taskId) => {
    const response = await api.delete(`/sprints/${sprintId}/tasks/${taskId}`);
    return response.data;
  },

  getSprintBurndown: async (id) => {
    const response = await api.get(`/sprints/${id}/burndown`);
    return response.data;
  },
};

// Comments API
export const commentsAPI = {
  getComments: async (taskId) => {
    const response = await api.get(`/comments/task/${taskId}`);
    return response.data;
  },

  createComment: async (taskId, commentData) => {
    const response = await api.post(`/comments/task/${taskId}`, commentData);
    return response.data;
  },

  updateComment: async (id, commentData) => {
    const response = await api.put(`/comments/${id}`, commentData);
    return response.data;
  },

  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getAnalytics: async () => {
    const response = await api.get('/dashboard/analytics');
    return response.data;
  },

  getMyTasks: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/dashboard/my-tasks?${params}`);
    return response.data;
  },

  getNotifications: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/dashboard/notifications?${params}`);
    return response.data;
  },

  markNotificationRead: async (id) => {
    const response = await api.put(`/dashboard/notifications/${id}/read`);
    return response.data;
  },

  markAllNotificationsRead: async () => {
    const response = await api.put('/dashboard/notifications/read-all');
    return response.data;
  },
};

export default api;
