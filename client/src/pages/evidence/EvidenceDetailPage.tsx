import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Sparkles, MoreHorizontal } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { CaseTabs } from '../../components/cases/CaseTabs';
import { EvidencePreview } from '../../components/evidence/EvidencePreview';
import { EvidenceMetadata } from '../../components/evidence/EvidenceMetadata';
import { IntegrityPanel } from '../../components/evidence/IntegrityPanel';
import { ChainOfCustody } from '../../components/evidence/ChainOfCustody';
import { AIAnalysisPanel } from '../../components/evidence/AIAnalysisPanel';
import { EvidenceComments } from '../../components/evidence/EvidenceComments';
import { EvidenceStatusBadge } from '../../components/evidence/EvidenceStatusBadge';
import { mockEvidence, mockEvidenceAIAnalysis, mockEvidenceComments, mockEvidenceCustody } from '../../data/mockData';

const EvidenceDetailPage = () => {
  const { evidenceId } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<string | null>(null);

  const evidence = useMemo(() => mockEvidence.find((item) => item.id === evidenceId), [evidenceId]);

  if (!evidence) {
    return (
      <AppLayout title="Evidence not found">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-600">The requested evidence could not be found.</p>
        </div>
      </AppLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'integrity', label: 'Integrity' },
    { id: 'custody', label: 'Chain of Custody' },
    { id: 'ai', label: 'AI Analysis' },
    { id: 'comments', label: 'Comments' },
  ];

  const handleMockAction = (label: string) => {
    setFeedback(`${label} simulated successfully.`);
  };

  return (
    <AppLayout title={evidence.evidenceNumber}>
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button type="button" onClick={() => navigate('/evidence')} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600">
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-indigo-600">{evidence.evidenceNumber}</p>
            <h1 className="text-2xl font-semibold text-slate-900">{evidence.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <EvidenceStatusBadge integrityStatus={evidence.integrityStatus} reviewStatus={evidence.reviewStatus} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => handleMockAction('Download')}> <span className="flex items-center gap-2"><Download size={16} /> Download</span></Button>
          <Button variant="secondary" onClick={() => handleMockAction('Share')}><span className="flex items-center gap-2"><Share2 size={16} /> Share</span></Button>
          <Button variant="secondary" onClick={() => handleMockAction('Review Request')}><span className="flex items-center gap-2"><Sparkles size={16} /> Request Review</span></Button>
          <Button variant="ghost"><MoreHorizontal size={16} /></Button>
        </div>
      </div>

      {feedback ? <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</div> : null}

      <CaseTabs tabs={tabs} children={{
        overview: <div className="space-y-6"><EvidencePreview evidence={evidence} /><EvidenceMetadata evidence={evidence} /></div>,
        integrity: <IntegrityPanel evidence={evidence} />,
        custody: <ChainOfCustody events={mockEvidenceCustody} />,
        ai: <AIAnalysisPanel analysis={mockEvidenceAIAnalysis[0]} />,
        comments: <EvidenceComments comments={mockEvidenceComments} />,
      }} />
    </AppLayout>
  );
};

export default EvidenceDetailPage;
