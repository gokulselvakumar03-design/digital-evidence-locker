import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { NotificationCenter } from '../../components/notifications/NotificationCenter';
import { PageHeader } from '../../components/ui/PageHeader';
import { notificationService } from '../../services/notification.service';
import type { Notification } from '../../types';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(() => notificationService.getNotifications());

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  const handleViewCase = (caseId?: string) => {
    if (caseId) navigate(`/cases/${caseId}`);
  };

  const handleViewEvidence = (evidenceId?: string) => {
    if (evidenceId) navigate(`/evidence/${evidenceId}`);
  };

  const handleMarkRead = (notificationId: string) => {
    setNotifications((current) => current.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)));
  };

  const handleDelete = (notificationId: string) => {
    setNotifications((current) => current.filter((notification) => notification.id !== notificationId));
  };

  return (
    <AppLayout title="Notifications">
      <PageHeader
        title="Notifications"
        description="Secure bulletin center for review, escalation, and evidence activity."
        action={
          <div className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
            {unreadCount} unread
          </div>
        }
      />

      <NotificationCenter
        notifications={notifications}
        onViewCase={handleViewCase}
        onViewEvidence={handleViewEvidence}
        onMarkRead={handleMarkRead}
        onDelete={handleDelete}
      />
    </AppLayout>
  );
};

export default NotificationsPage;
