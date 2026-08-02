import { AppLayout } from '../../components/layout/AppLayout';
import { TimelineExperience } from '../../components/timeline/TimelineExperience';
import { mockAuditEvents, mockCases, mockUsers } from '../../data/mockData';

const TimelinePage = () => {
  return (
    <AppLayout title="Timeline">
      <TimelineExperience events={mockAuditEvents} cases={mockCases} users={mockUsers} />
    </AppLayout>
  );
};

export default TimelinePage;
