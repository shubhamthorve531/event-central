import axios from 'axios';
import type { LoginResponse, RegisterResponse } from '../types/Auth';

// Create axios instance for auth endpoints
const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth tokens if needed
authApi.interceptors.request.use(
  (config) => {
    // Add auth token if available for protected routes
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

// Response interceptor for handling auth errors
authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle auth-specific errors
    if (error.response?.status === 401) {
      // Unauthorized - clear stored auth data
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      console.error('Authentication failed - redirecting to login');
    } else if (error.response?.status === 403) {
      console.error('Access forbidden');
    } else if (error.response?.status === 500) {
      console.error('Server error during authentication:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export const AuthService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await authApi.post<LoginResponse>('/login', {
        email,
        password,
      });
      
      // Store token and user data if login successful
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        
        // Store user data from response
        const userData = {
          email: response.data.email,
          fullName: response.data.fullName
        };
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid email or password');
        } else if (error.response?.status === 400) {
          throw new Error('Please provide valid email and password');
        } else if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  async register(fullname: string, email: string, password: string): Promise<RegisterResponse> {
    try {
      const response = await authApi.post<RegisterResponse>('/register', {
        fullname,
        email,
        password,
      });
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error('Email already exists. Please use a different email.');
        } else if (error.response?.status === 400) {
          throw new Error(error?.response?.data || 'Invalid registration data');
        } else if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw new Error('Registration failed. Please try again.');
    }
  },

  async logout(): Promise<void> {
    try {
      // Call logout endpoint if your backend has one
      await authApi.post('/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    }
  },

  async refreshToken(): Promise<LoginResponse> {
    try {
      const response = await authApi.post<LoginResponse>('/refresh');
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        
        const userData = {
          email: response.data.email,
          fullName: response.data.fullName
        };
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear stored auth data on refresh failure
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      throw new Error('Session expired. Please login again.');
    }
  },

  // Utility methods
  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  getStoredRole(): string | null {
    return localStorage.getItem('role');
  },

  getStoredUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    return !!token;
  },
};