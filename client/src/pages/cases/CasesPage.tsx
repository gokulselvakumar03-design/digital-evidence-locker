import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, ClipboardList, FolderKanban, ShieldCheck } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { CaseFilters } from '../../components/cases/CaseFilters';
import { CaseSearch } from '../../components/cases/CaseSearch';
import { CaseTable } from '../../components/cases/CaseTable';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { caseService } from '../../services/case.service';
import type { CasePriority, CaseStatus } from '../../types';

const CasesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'ALL' | CaseStatus>('ALL');
  const [priority, setPriority] = useState<'ALL' | CasePriority>('ALL');
  const [sortBy, setSortBy] = useState<'updated' | 'oldest' | 'newest'>('updated');

  const successMessage = (location.state as { successMessage?: string } | null)?.successMessage;
  const allCases = caseService.getCases();

  const filteredCases = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const nextCases = allCases.filter((item) => {
      const matchesStatus = status === 'ALL' || item.status === status;
      const matchesPriority = priority === 'ALL' || item.priority === priority;
      const haystack = `${item.title} ${item.caseNumber} ${item.assignedTo} ${item.client ?? ''} ${item.type ?? ''}`.toLowerCase();
      const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery);

      return matchesStatus && matchesPriority && matchesQuery;
    });

    return [...nextCases].sort((left, right) => {
      const leftDate = new Date(left.updatedAt).getTime();
      const rightDate = new Date(right.updatedAt).getTime();
      if (sortBy === 'oldest') {
        return leftDate - rightDate;
      }
      if (sortBy === 'newest') {
        return rightDate - leftDate;
      }
      return rightDate - leftDate;
    });
  }, [priority, query, sortBy, status]);

  const summaryCards = [
    { title: 'Total Cases', value: allCases.length, description: 'All active and archived matters', icon: <Briefcase size={18} /> },
    { title: 'Active Cases', value: allCases.filter((item) => item.status === 'ACTIVE').length, description: 'Currently in motion', icon: <ShieldCheck size={18} /> },
    { title: 'Pending Review', value: allCases.filter((item) => item.status === 'PENDING_REVIEW').length, description: 'Awaiting legal review', icon: <ClipboardList size={18} /> },
    { title: 'Closed Cases', value: allCases.filter((item) => item.status === 'CLOSED').length, description: 'Completed and archived', icon: <FolderKanban size={18} /> },
  ];

  return (
    <AppLayout title="Cases">
      <PageHeader
        title="Cases"
        description="Manage and monitor legal cases and associated evidence."
        action={
          <Button onClick={() => navigate('/cases/new')}>
            + New Case
          </Button>
        }
      />

      {successMessage ? (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} description={item.description} icon={item.icon} />
        ))}
      </div>

      <Card title="Case workspace" description="Search, filter, and open legal matters from a single workspace." className="mt-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <CaseSearch value={query} onChange={setQuery} />
          <CaseFilters status={status} priority={priority} sortBy={sortBy} onStatusChange={setStatus} onPriorityChange={setPriority} onSortChange={setSortBy} />
        </div>

        {filteredCases.length > 0 ? (
          <CaseTable cases={filteredCases} onSelect={(caseId) => navigate(`/cases/${caseId}`)} />
        ) : (
          <EmptyState title="No cases matched your filters" description="Try adjusting your search or status selections to view additional matters." />
        )}
      </Card>
    </AppLayout>
  );
};

export default CasesPage;
