import axios from 'axios';
import type { Event } from '../types/Event';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for adding auth tokens or other headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // assuming token is stored here
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - redirecting to login');
      // You can optionally redirect or trigger logout here
    } else if (error.response?.status === 403) {
      console.error('Forbidden access');
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Event API service
export const EventService = {
  async getEvents(): Promise<Event[]> {
    const response = await api.get<Event[]>('/event');
    return response.data;
  },

  async getEvent(id: number): Promise<Event> {
    const response = await api.get<Event>(`/event/${id}`);
    return response.data;
  },

  async createEvent(event: Event): Promise<Event> {
    const response = await api.post<Event>('/event', event);
    return response.data;
  },

  async updateEvent(event: Event): Promise<Event> {
    const response = await api.put<Event>(`/event/${event.id}`, event);
    return response.data;
  },

  async deleteEvent(id: number): Promise<void> {
    await api.delete(`/event/${id}`);
  },
};
