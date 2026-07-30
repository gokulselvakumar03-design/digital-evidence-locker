import api from './api';

export const evidenceService = {
  listByCase: (caseId: string) => api.get(`/evidence/case/${caseId}`),
  verify: (id: string, payload: { providedSha256Hash: string }) => api.post(`/evidence/${id}/verify`, payload),
};
