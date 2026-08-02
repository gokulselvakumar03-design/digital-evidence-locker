import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { NotificationFilter } from './NotificationFilter';
import { NotificationList } from './NotificationList';
import { NotificationModal } from './NotificationModal';
import { NotificationSettings } from './NotificationSettings';
import type { Notification, NotificationCategory } from '../../types';

interface NotificationCenterProps {
  notifications: Notification[];
  onViewCase: (caseId?: string) => void;
  onViewEvidence: (evidenceId?: string) => void;
  onMarkRead: (notificationId: string) => void;
  onDelete: (notificationId: string) => void;
}

const categoryOptions = ['All', 'Unread', 'Case Updates', 'Evidence', 'Timeline', 'Security', 'AI Analysis', 'System'];

const formatCategoryLabel = (label: string): NotificationCategory => {
  const map: Record<string, NotificationCategory> = {
    All: 'ALL',
    Unread: 'UNREAD',
    'Case Updates': 'CASE_UPDATES',
    Evidence: 'EVIDENCE',
    Timeline: 'TIMELINE',
    Security: 'SECURITY',
    'AI Analysis': 'AI_ANALYSIS',
    System: 'SYSTEM',
  };

  return map[label] ?? 'ALL';
};

export const NotificationCenter = ({ notifications, onViewCase, onViewEvidence, onMarkRead, onDelete }: NotificationCenterProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Notification | null>(null);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const categoryFilter = (() => {
        if (selectedCategory === 'All') return true;
        if (selectedCategory === 'Unread') return !notification.read;
        if (notification.category === undefined) return false;
        return notification.category === formatCategoryLabel(selectedCategory);
      })();

      if (!categoryFilter) return false;

      if (!search.trim()) return true;

      const query = search.toLowerCase();
      return [
        notification.title,
        notification.description,
        notification.caseId,
        notification.evidenceId,
        notification.user,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [notifications, search, selectedCategory]);

  const unreadCount = notifications.filter((item) => !item.read).length;
  const todayCount = notifications.filter((item) => item.createdAt.includes('minutes ago') || item.createdAt.includes('hours ago')).length;
  const evidenceAlerts = notifications.filter((item) => item.type === 'EVIDENCE').length;
  const securityAlerts = notifications.filter((item) => item.type === 'SECURITY').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[{ label: 'Unread Notifications', value: unreadCount }, { label: "Today's Notifications", value: todayCount }, { label: 'Evidence Alerts', value: evidenceAlerts }, { label: 'Security Alerts', value: securityAlerts }].map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, case ID, evidence ID, or user"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <NotificationFilter value={selectedCategory} onChange={setSelectedCategory} options={categoryOptions} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <NotificationList notifications={filteredNotifications} onSelect={setSelected} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Notification Settings</h3>
          <p className="mt-1 text-sm text-slate-500">Mock preferences for workflow and alert delivery.</p>
          <div className="mt-4">
            <NotificationSettings />
          </div>
        </div>
      </div>

      <NotificationModal
        notification={selected}
        onClose={() => setSelected(null)}
        onViewCase={onViewCase}
        onViewEvidence={onViewEvidence}
        onMarkRead={(notificationId) => {
          onMarkRead(notificationId);
          setSelected((previous) => (previous && previous.id === notificationId ? { ...previous, read: true } : previous));
        }}
        onDelete={(notificationId) => {
          onDelete(notificationId);
          setSelected(null);
        }}
      />
    </div>
  );
};
