import { Bell, ChevronDown, Search, UserCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notification.service';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { Button } from '../ui/Button';
import type { Notification } from '../../types';

interface NavbarProps {
  title: string;
}

export const Navbar = ({ title }: NavbarProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(() => notificationService.getNotifications());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  const handleMarkAllRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  const handleSelectNotification = (notification: Notification) => {
    setNotifications((current) => current.map((item) => (item.id === notification.id ? { ...item, read: true } : item)));
    if (notification.caseId) navigate(`/cases/${notification.caseId}`);
    else if (notification.evidenceId) navigate(`/evidence/${notification.evidenceId}`);
    else navigate('/notifications');
    setDropdownOpen(false);
  };

  return (
    <header className="relative flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 md:px-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Secure Legal Operations</p>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <label className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:flex">
          <Search size={16} />
          <input className="w-36 bg-transparent outline-none" placeholder="Search" />
        </label>

        <div className="relative">
          <Button variant="ghost" className="relative rounded-full p-2" onClick={() => setDropdownOpen((value) => !value)}>
            <Bell size={18} />
            {unreadCount > 0 ? <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-semibold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span> : null}
          </Button>

          {dropdownOpen ? (
            <NotificationDropdown
              notifications={notifications}
              onViewAll={() => {
                setDropdownOpen(false);
                navigate('/notifications');
              }}
              onMarkAllRead={handleMarkAllRead}
              onSelect={handleSelectNotification}
            />
          ) : null}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
          <UserCircle2 size={18} className="text-indigo-600" />
          <div className="hidden text-left md:block">
            <p className="text-sm font-medium text-slate-900">{user?.firstName ?? 'User'}</p>
            <p className="text-xs text-slate-500">{user?.role ?? 'Member'}</p>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
};
