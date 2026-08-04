import {
  mockActivities,
  mockCases,
  mockDashboardStats,
  mockEvidence,
} from '../data/mockData';

export const dashboardService = {
  getStats: () => mockDashboardStats,
  getCases: () => mockCases,
  getEvidence: () => mockEvidence,
  getActivities: () => mockActivities,
};
