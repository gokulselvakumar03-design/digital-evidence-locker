import api from './api';

export const caseService = {
  list: () => api.get('/cases'),
  getById: (id: string) => api.get(`/cases/${id}`),
};
