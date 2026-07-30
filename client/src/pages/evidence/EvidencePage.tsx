import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';

const EvidencePage = () => {
  return (
    <AppLayout title="Evidence Locker">
      <PageHeader title="Evidence locker" description="Placeholder view for evidence upload and verification workflows." />
      <Card title="Upcoming evidence workspace">
        <EmptyState title="Evidence workflows are pending" description="This route is active so the next implementation step can plug in directly." />
      </Card>
    </AppLayout>
  );
};

export default EvidencePage;
