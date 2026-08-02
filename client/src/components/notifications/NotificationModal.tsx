import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { Notification } from '../../types';

interface NotificationModalProps {
  notification: Notification | null;
  onClose: () => void;
  onViewCase?: (caseId?: string) => void;
  onViewEvidence?: (evidenceId?: string) => void;
  onMarkRead?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
}

export const NotificationModal = ({ notification, onClose, onViewCase, onViewEvidence, onMarkRead, onDelete }: NotificationModalProps) => {
  if (!notification) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">{notification.category ?? notification.type}</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{notification.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500">
            <X size={16} />
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <Badge tone={notification.priority === 'CRITICAL' ? 'rose' : notification.priority === 'HIGH' ? 'amber' : notification.priority === 'LOW' ? 'slate' : 'indigo'}>{notification.priority ?? 'MEDIUM'}</Badge>
          <Badge tone={notification.read ? 'slate' : 'indigo'}>{notification.read ? 'Read' : 'Unread'}</Badge>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Description</dt><dd className="mt-1 text-slate-700">{notification.description}</dd></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Timestamp</dt><dd className="mt-1 text-slate-700">{notification.createdAt}</dd></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Category</dt><dd className="mt-1 text-slate-700">{notification.category ?? 'SYSTEM'}</dd></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Related Case</dt><dd className="mt-1 text-slate-700">{notification.caseId ?? '—'}</dd></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Related Evidence</dt><dd className="mt-1 text-slate-700">{notification.evidenceId ?? '—'}</dd></div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-2">
          {notification.caseId ? <Button variant="secondary" onClick={() => onViewCase?.(notification.caseId)}>View Case</Button> : null}
          {notification.evidenceId ? <Button variant="secondary" onClick={() => onViewEvidence?.(notification.evidenceId)}>View Evidence</Button> : null}
          <Button variant="secondary" onClick={() => onMarkRead?.(notification.id)}>{notification.read ? 'Mark Unread' : 'Mark as Read'}</Button>
          <Button variant="secondary" onClick={() => onDelete?.(notification.id)}>Delete Notification</Button>
        </div>
      </div>
    </div>
  );
};
