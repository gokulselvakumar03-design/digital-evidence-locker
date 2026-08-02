import api from './api';
import { mockNotifications } from '../data/mockData';

export const notificationService = {
  list: () => api.get('/notifications').catch(() => ({ data: mockNotifications })),
  getNotifications: () => mockNotifications,
  getUnreadCount: (items = mockNotifications) => items.filter((item) => !item.read).length,
};
