import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';

const NotificationsPage = () => {
  return (
    <AppLayout title="Notifications">
      <PageHeader title="Notifications" description="Secure bulletin center for review and escalation notices." />
      <Card title="Upcoming notifications workspace">
        <EmptyState title="Notifications experience is pending" description="This route is ready to receive workflow alerts and inbox features." />
      </Card>
    </AppLayout>
  );
};

export default NotificationsPage;
