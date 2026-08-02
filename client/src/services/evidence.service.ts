import api from './api';
import { mockEvidence } from '../data/mockData';

export const evidenceService = {
  listByCase: (caseId: string) => api.get(`/evidence/case/${caseId}`).catch(() => ({ data: mockEvidence.filter((item) => item.caseId === caseId) })),
  getEvidence: () => mockEvidence,
  getById: (id: string) => api.get(`/evidence/${id}`).catch(() => ({ data: mockEvidence.find((item) => item.id === id) ?? null })),
  verify: (id: string, payload: { providedSha256Hash: string }) => api.post(`/evidence/${id}/verify`, payload),
};
