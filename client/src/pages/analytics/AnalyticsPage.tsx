import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';

const AnalyticsPage = () => {
  return (
    <AppLayout title="Analytics">
      <PageHeader title="Analytics dashboard" description="Placeholder analytics surface for reporting and insights." />
      <Card title="Upcoming analytics workspace">
        <EmptyState title="Reporting views are pending" description="The authenticated shell is ready for analytics widgets in the next phase." />
      </Card>
    </AppLayout>
  );
};

export default AnalyticsPage;
