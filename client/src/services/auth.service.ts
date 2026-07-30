import api from './api';

export const authService = {
  login: (payload: { email: string; password: string }) => api.post('/auth/login', payload),
  register: (payload: Record<string, unknown>) => api.post('/auth/register', payload),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};
