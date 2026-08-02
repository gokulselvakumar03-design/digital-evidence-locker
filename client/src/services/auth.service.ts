import api from './api';

export const authService = {
  login: async (payload: { email: string; password: string }) => api.post('/auth/login', payload),
  register: async (payload: Record<string, unknown>) => api.post('/auth/register', payload),
  logout: async () => api.post('/auth/logout'),
  getCurrentUser: async () => api.get('/auth/me'),
};
