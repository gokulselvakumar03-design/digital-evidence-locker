import { BellRing, CheckCheck, FileText, ShieldAlert, Sparkles, TimerReset } from 'lucide-react';
import { NotificationBadge } from './NotificationBadge';
import type { Notification } from '../../types';

interface NotificationCardProps {
  notification: Notification;
  onSelect: (notification: Notification) => void;
}

const getNotificationIcon = (notification: Notification) => {
  switch (notification.type) {
    case 'SECURITY':
      return <ShieldAlert size={16} />;
    case 'EVIDENCE':
      return <FileText size={16} />;
    case 'AI_ANALYSIS':
      return <Sparkles size={16} />;
    case 'CASE':
      return <BellRing size={16} />;
    case 'SYSTEM':
      return <TimerReset size={16} />;
    default:
      return <CheckCheck size={16} />;
  }
};

export const NotificationCard = ({ notification, onSelect }: NotificationCardProps) => {
  return (
    <button type="button" onClick={() => onSelect(notification)} className={`w-full rounded-2xl border p-4 text-left transition ${notification.read ? 'border-slate-200 bg-slate-50 opacity-80' : 'border-indigo-200 bg-white shadow-sm'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 rounded-xl p-2 ${notification.read ? 'bg-slate-100 text-slate-500' : 'bg-indigo-50 text-indigo-600'}`}>
            {getNotificationIcon(notification)}
          </div>
          <div>
            <p className={`font-semibold ${notification.read ? 'text-slate-600' : 'text-slate-900'}`}>{notification.title}</p>
            <p className="mt-1 text-sm text-slate-600">{notification.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{notification.createdAt}</span>
              {notification.caseId ? <span>•</span> : null}
              {notification.caseId ? <span>{notification.caseId}</span> : null}
            </div>
          </div>
        </div>
        <NotificationBadge notification={notification} compact />
      </div>
    </button>
  );
};
