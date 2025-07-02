import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Đổi từ /api/v1 sang /api để mapping đúng backend
  withCredentials: true, // For cookie-based auth if needed
});

// Request interceptor to add auth token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized globally
      if (error.response.status === 401) {
        // Optionally, redirect to login or clear user session
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Task Management Endpoints ---
export const fetchTasks = () => api.get('/tasks');
export const fetchTask = (id: number) => api.get(`/tasks/${id}`);
export const createTask = (task: any) => api.post('/tasks', task);
export const updateTask = (id: number, task: any) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);

// --- Auth Endpoints ---
export const register = (data: any) => api.post('/auth/register', data);
export const login = (data: any) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');

export default api;
