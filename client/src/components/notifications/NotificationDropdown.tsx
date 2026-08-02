import { Bell, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Notification } from '../../types';

interface NotificationDropdownProps {
  notifications: Notification[];
  onViewAll: () => void;
  onMarkAllRead: () => void;
  onSelect: (notification: Notification) => void;
}

export const NotificationDropdown = ({ notifications, onViewAll, onMarkAllRead, onSelect }: NotificationDropdownProps) => {
  return (
    <div className="absolute right-0 top-full z-40 mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between px-2">
        <p className="text-sm font-semibold text-slate-900">Notifications</p>
        <button type="button" onClick={onMarkAllRead} className="text-xs font-medium text-indigo-600">Mark All Read</button>
      </div>

      <div className="space-y-2">
        {notifications.slice(0, 5).map((notification) => (
          <button key={notification.id} type="button" onClick={() => onSelect(notification)} className={`w-full rounded-xl border p-3 text-left ${notification.read ? 'border-slate-200 bg-slate-50' : 'border-indigo-200 bg-indigo-50/50'}`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                <p className="mt-1 text-xs text-slate-500">{notification.description}</p>
              </div>
              {!notification.read ? <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-600" /> : null}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">{notification.createdAt}</p>
          </button>
        ))}
      </div>

      <div className="mt-3 border-t border-slate-200 pt-3">
        <Button variant="secondary" className="w-full" onClick={onViewAll}>
          <span className="flex items-center justify-center gap-2"><Bell size={14} /> View All <ChevronRight size={14} /></span>
        </Button>
      </div>
    </div>
  );
};
