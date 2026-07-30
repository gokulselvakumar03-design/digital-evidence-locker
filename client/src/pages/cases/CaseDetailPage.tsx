import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Files, PlusCircle, MoreHorizontal } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { CaseTabs } from '../../components/cases/CaseTabs';
import { CaseOverview } from '../../components/cases/CaseOverview';
import { CaseEvidence } from '../../components/cases/CaseEvidence';
import { CaseTimeline } from '../../components/cases/CaseTimeline';
import { CaseTeam } from '../../components/cases/CaseTeam';
import { CaseActivity } from '../../components/cases/CaseActivity';
import { CaseStatusBadge } from '../../components/cases/CaseStatusBadge';
import { PriorityBadge } from '../../components/cases/PriorityBadge';
import { mockCaseTeam, mockCaseTimeline, mockCases, mockEvidence, mockActivities } from '../../data/mockData';

const CaseDetailPage = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const caseItem = useMemo(() => mockCases.find((item) => item.id === caseId), [caseId]);
  const evidence = useMemo(() => mockEvidence.filter((item) => item.caseId === caseId), [caseId]);

  if (!caseItem) {
    return (
      <AppLayout title="Case not found">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-600">The requested case could not be found.</p>
        </div>
      </AppLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'team', label: 'Team' },
    { id: 'activity', label: 'Activity' },
  ];

  return (
    <AppLayout title={caseItem.caseNumber}>
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button type="button" onClick={() => navigate('/cases')} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600">
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-indigo-600">{caseItem.caseNumber}</p>
            <h1 className="text-2xl font-semibold text-slate-900">{caseItem.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <CaseStatusBadge status={caseItem.status} />
              <PriorityBadge priority={caseItem.priority} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => navigate(`/cases/${caseItem.id}/edit`)}>
            Edit Case
          </Button>
          <Button variant="secondary">
            <span className="flex items-center gap-2"><PlusCircle size={16} /> Add Evidence</span>
          </Button>
          <Button variant="ghost">
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </div>

      <CaseTabs tabs={tabs} children={{
        overview: <CaseOverview caseItem={caseItem} evidence={evidence} team={mockCaseTeam} />,
        evidence: <CaseEvidence evidence={evidence} />,
        timeline: <CaseTimeline events={mockCaseTimeline} />,
        team: <CaseTeam members={mockCaseTeam} />,
        activity: <CaseActivity activities={mockActivities} />,
      }} />

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600"><Files size={18} /></div>
          <div>
            <p className="font-semibold text-slate-900">Case workspace summary</p>
            <p className="text-sm text-slate-500">All case views are mocked and ready for future API integration.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CaseDetailPage;
