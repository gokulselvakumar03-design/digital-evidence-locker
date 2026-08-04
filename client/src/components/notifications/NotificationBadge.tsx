import type { Notification } from '../../types';

interface NotificationBadgeProps {
  notification: Notification;
  compact?: boolean;
}

export const NotificationBadge = ({ notification, compact = false }: NotificationBadgeProps) => {
  const priorityStyles: Record<string, string> = {
    LOW: 'bg-slate-100 text-slate-700',
    MEDIUM: 'bg-amber-100 text-amber-700',
    HIGH: 'bg-orange-100 text-orange-700',
    CRITICAL: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="flex items-center gap-2">
      {!notification.read ? <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" /> : null}
      {!compact ? <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${priorityStyles[notification.priority ?? 'MEDIUM']}`}>{notification.priority ?? 'MEDIUM'}</span> : null}
    </div>
  );
};
