import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';

const TimelinePage = () => {
  return (
    <AppLayout title="Timeline">
      <PageHeader title="Case timeline" description="Placeholder timeline view for event history and milestones." />
      <Card title="Upcoming timeline workspace">
        <EmptyState title="Timeline experience is forthcoming" description="The shell is in place and will support enriched activity tracking soon." />
      </Card>
    </AppLayout>
  );
};

export default TimelinePage;
