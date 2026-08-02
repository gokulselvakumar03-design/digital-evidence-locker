import { NotificationCard } from './NotificationCard';
import type { Notification } from '../../types';

interface NotificationListProps {
  notifications: Notification[];
  onSelect: (notification: Notification) => void;
}

export const NotificationList = ({ notifications, onSelect }: NotificationListProps) => {
  if (!notifications.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
        No notifications match the selected filters.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} onSelect={onSelect} />
      ))}
    </div>
  );
};
