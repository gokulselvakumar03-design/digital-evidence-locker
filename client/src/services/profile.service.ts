import {
  mockNotificationPreferences,
  mockPrivacySettings,
  mockProfile,
  mockProfileActivity,
  mockProfileSessions,
  mockProfileSettings,
} from '../data/mockData';

export const profileService = {
  getProfile: () => mockProfile,
  getProfileSettings: () => mockProfileSettings,
  getNotificationPreferences: () => mockNotificationPreferences,
  getPrivacySettings: () => mockPrivacySettings,
  getProfileSessions: () => mockProfileSessions,
  getProfileActivity: () => mockProfileActivity,
};
