import axios from 'axios';
import type { Event } from '../types/Event';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const EventRegistrationService = {
  async registerForEvent(eventId: number): Promise<{ message: string }> {
    const response = await api.post(`/eventregistration/${eventId}`);
    return response.data;
  },

  async unregisterFromEvent(eventId: number): Promise<{ message: string }> {
    const response = await api.delete(`/eventregistration/${eventId}`);
    return response.data;
  },

  async getMyRegistrations(): Promise<Event[]> {
    const response = await api.get('/eventregistration/mine');
    return response.data;
  },

  async getRegistrationCount(eventId: number): Promise<{ count: number }> {
    const response = await api.get(`/eventregistration/${eventId}/count`);
    return response.data;
  },

  async isRegistered(eventId: number): Promise<{ isRegistered: boolean }> {
    const response = await api.get(`/eventregistration/${eventId}/is-registered`);
    return response.data;
  },
};