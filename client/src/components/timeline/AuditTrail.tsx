import { Badge } from '../ui/Badge';
import type { AuditEvent, Case } from '../../types';

interface AuditTrailProps {
  events: AuditEvent[];
  cases: Case[];
  compact?: boolean;
}

const formatResource = (event: AuditEvent, cases: Case[]) => {
  if (event.caseId) {
    const matchedCase = cases.find((item) => item.id === event.caseId);
    return matchedCase ? matchedCase.caseNumber : event.caseId;
  }
  if (event.evidenceId) return event.evidenceId;
  return 'System';
};

const actionTone: Record<string, 'indigo' | 'slate' | 'emerald' | 'amber' | 'rose'> = {
  LOGIN: 'emerald',
  LOGOUT: 'slate',
  CASE_CREATED: 'indigo',
  CASE_UPDATED: 'indigo',
  CASE_STATUS_CHANGED: 'amber',
  EVIDENCE_UPLOADED: 'indigo',
  EVIDENCE_VIEWED: 'slate',
  EVIDENCE_DOWNLOADED: 'slate',
  EVIDENCE_SHARED: 'amber',
  INTEGRITY_VERIFIED: 'emerald',
  REVIEW_REQUESTED: 'amber',
  COMMENT_ADDED: 'slate',
};

export const AuditTrail = ({ events, cases, compact = false }: AuditTrailProps) => {
  if (!events.length) {
    return <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">No audit activity found for the selected filters.</div>;
  }

  if (compact) {
    return (
      <div className="space-y-3">
        {events.slice(0, 5).map((event) => (
          <div key={event.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-900">{event.user}</p>
                <Badge tone={actionTone[event.action] ?? 'slate'}>{event.action}</Badge>
              </div>
              <span className="text-xs text-slate-400">{new Date(event.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{event.title}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{formatResource(event, cases)}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="px-3 py-3 font-medium">Timestamp</th>
            <th className="px-3 py-3 font-medium">User</th>
            <th className="px-3 py-3 font-medium">Role</th>
            <th className="px-3 py-3 font-medium">Action</th>
            <th className="px-3 py-3 font-medium">Resource</th>
            <th className="px-3 py-3 font-medium">Case</th>
            <th className="px-3 py-3 font-medium">IP Address</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b border-slate-100 align-top text-slate-700">
              <td className="px-3 py-3 whitespace-nowrap">{new Date(event.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
              <td className="px-3 py-3">
                <div className="font-medium text-slate-900">{event.user}</div>
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-slate-500">{event.role}</td>
              <td className="px-3 py-3"><Badge tone={actionTone[event.action] ?? 'slate'}>{event.action}</Badge></td>
              <td className="px-3 py-3">{event.evidenceId ?? event.title}</td>
              <td className="px-3 py-3">{event.caseId ? cases.find((item) => item.id === event.caseId)?.caseNumber ?? event.caseId : '—'}</td>
              <td className="px-3 py-3">{event.ipAddress ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
