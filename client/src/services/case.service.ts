import api from './api';
import { mockCases } from '../data/mockData';

export const caseService = {
  list: () => api.get('/cases').catch(() => ({ data: mockCases })),
  getCases: () => mockCases,
  getById: (id: string) => api.get(`/cases/${id}`).catch(() => ({ data: mockCases.find((item) => item.id === id) ?? null })),
  getCaseById: (id: string) => mockCases.find((item) => item.id === id) ?? null,
};
