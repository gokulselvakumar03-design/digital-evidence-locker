import {
  mockAdminAnalytics,
  mockAdminAuditLogs,
  mockAdminHealth,
  mockAdminPlatformSettings,
  mockAdminRoles,
  mockAdminSecurity,
  mockAdminStorage,
  mockAdminSummary,
  mockAdminUsers,
  mockPermissionMatrix,
} from '../data/mockData';

export const adminService = {
  getSummary: () => mockAdminSummary,
  getUsers: () => mockAdminUsers,
  getRoles: () => mockAdminRoles,
  getAuditLogs: () => mockAdminAuditLogs,
  getHealth: () => mockAdminHealth,
  getStorage: () => mockAdminStorage,
  getAnalytics: () => mockAdminAnalytics,
  getSecurity: () => mockAdminSecurity,
  getPlatformSettings: () => mockAdminPlatformSettings,
  getPermissionMatrix: () => mockPermissionMatrix,
};
