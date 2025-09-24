import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast({
        title: 'Authentication Error',
        description: 'Your session has expired. Please log in again.',
        variant: 'destructive',
      });
    } else if (error.response?.status >= 500) {
      toast({
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later.',
        variant: 'destructive',
      });
    } else if (error.response?.data?.message) {
      toast({
        title: 'Error',
        description: error.response.data.message,
        variant: 'destructive',
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;