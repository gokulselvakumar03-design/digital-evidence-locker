import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';

const ProfilePage = () => {
  return (
    <AppLayout title="Profile">
      <PageHeader title="User profile" description="Profile and role awareness placeholder for the next milestone." />
      <Card title="Upcoming profile workspace">
        <EmptyState title="Profile settings are pending" description="The layout is ready for role-based profile management and preferences." />
      </Card>
    </AppLayout>
  );
};

export default ProfilePage;
