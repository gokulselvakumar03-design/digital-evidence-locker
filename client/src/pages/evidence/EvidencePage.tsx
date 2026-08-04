import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, ScanLine, ShieldCheck, Sparkles } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { EvidenceFilters } from '../../components/evidence/EvidenceFilters';
import { EvidenceTable } from '../../components/evidence/EvidenceTable';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { evidenceService } from '../../services/evidence.service';
import type { EvidenceType, IntegrityStatus, ReviewStatus } from '../../types';

const EvidencePage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | EvidenceType>('ALL');
  const [integrityFilter, setIntegrityFilter] = useState<'ALL' | IntegrityStatus>('ALL');
  const [reviewFilter, setReviewFilter] = useState<'ALL' | ReviewStatus>('ALL');
  const [sortBy, setSortBy] = useState<'uploaded' | 'oldest' | 'name' | 'size'>('uploaded');
  const allEvidence = evidenceService.getEvidence();

  const filteredEvidence = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const nextEvidence = allEvidence.filter((item) => {
      const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
      const matchesIntegrity = integrityFilter === 'ALL' || item.integrityStatus === integrityFilter;
      const matchesReview = reviewFilter === 'ALL' || item.reviewStatus === reviewFilter;
      const haystack = `${item.title} ${item.evidenceNumber} ${item.caseId} ${item.uploadedBy}`.toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery);
      return matchesType && matchesIntegrity && matchesReview && matchesQuery;
    });

    return [...nextEvidence].sort((left, right) => {
      if (sortBy === 'oldest') {
        return new Date(left.uploadedAt).getTime() - new Date(right.uploadedAt).getTime();
      }
      if (sortBy === 'name') {
        return left.title.localeCompare(right.title);
      }
      if (sortBy === 'size') {
        return Number.parseInt(left.fileSize, 10) - Number.parseInt(right.fileSize, 10);
      }
      return new Date(right.uploadedAt).getTime() - new Date(left.uploadedAt).getTime();
    });
  }, [integrityFilter, query, reviewFilter, sortBy, typeFilter]);

  const summaryCards = [
    { title: 'Total Evidence', value: allEvidence.length, description: 'Evidence records staged for review', icon: <FolderKanban size={18} /> },
    { title: 'Verified', value: allEvidence.filter((item) => item.integrityStatus === 'VERIFIED').length, description: 'Integrity checks passed', icon: <ShieldCheck size={18} /> },
    { title: 'Pending Review', value: allEvidence.filter((item) => item.reviewStatus === 'PENDING_REVIEW').length, description: 'Awaiting legal review', icon: <Sparkles size={18} /> },
    { title: 'Integrity Alerts', value: allEvidence.filter((item) => item.integrityStatus === 'FAILED' || item.integrityStatus === 'FLAGGED').length, description: 'Items requiring attention', icon: <ScanLine size={18} /> },
  ];

  return (
    <AppLayout title="Evidence Locker">
      <PageHeader
        title="Evidence Locker"
        description="Securely manage, verify, and review digital evidence."
        action={<Button onClick={() => navigate('/evidence/upload')}>+ Upload Evidence</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} description={item.description} icon={item.icon} />
        ))}
      </div>

      <Card title="Evidence workspace" description="Search, filter, and inspect the evidence archive." className="mt-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full max-w-md">
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-1.5 block">Search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by evidence name, evidence ID, case ID, or uploader"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
          </div>
          <EvidenceFilters
            typeFilter={typeFilter}
            integrityFilter={integrityFilter}
            reviewFilter={reviewFilter}
            sortBy={sortBy}
            onTypeChange={setTypeFilter}
            onIntegrityChange={setIntegrityFilter}
            onReviewChange={setReviewFilter}
            onSortChange={setSortBy}
          />
        </div>

        {filteredEvidence.length > 0 ? <EvidenceTable evidence={filteredEvidence} /> : <EmptyState title="No evidence matched your filters" description="Adjust your search or filters to view additional records." />}
      </Card>
    </AppLayout>
  );
};

export default EvidencePage;
