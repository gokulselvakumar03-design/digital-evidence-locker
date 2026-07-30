import { Card } from '../ui/Card';
import { CaseStatusBadge } from './CaseStatusBadge';
import { PriorityBadge } from './PriorityBadge';
import type { Case, CaseTeamMember, Evidence } from '../../types';

interface CaseOverviewProps {
  caseItem: Case;
  evidence: Evidence[];
  team: CaseTeamMember[];
}

export const CaseOverview = ({ caseItem, evidence, team }: CaseOverviewProps) => {
  const stats = [
    { label: 'Evidence Files', value: evidence.length },
    { label: 'Team Members', value: team.length },
    { label: 'Timeline Events', value: 5 },
    { label: 'Pending Reviews', value: evidence.filter((item) => item.status === 'PENDING_REVIEW').length },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card title="Case Description" description="Current case profile and context.">
          <p className="text-sm leading-6 text-slate-600">{caseItem.description}</p>
        </Card>
        <Card title="Case Information" description="Key operational details.">
          <dl className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <dt className="font-medium text-slate-700">Case Type</dt>
              <dd>{caseItem.type ?? 'General'}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="font-medium text-slate-700">Status</dt>
              <dd><CaseStatusBadge status={caseItem.status} /></dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="font-medium text-slate-700">Priority</dt>
              <dd><PriorityBadge priority={caseItem.priority} /></dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="font-medium text-slate-700">Created</dt>
              <dd>{caseItem.createdAt}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card title="Incident Information" description="Incident and location details.">
          <dl className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <dt className="font-medium text-slate-700">Incident Date</dt>
              <dd>{caseItem.incidentDate ?? 'Not recorded'}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="font-medium text-slate-700">Location</dt>
              <dd>{caseItem.incidentLocation ?? 'Not recorded'}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="font-medium text-slate-700">Primary Client</dt>
              <dd>{caseItem.client ?? 'Unassigned'}</dd>
            </div>
          </dl>
        </Card>
        <Card title="Assigned Team" description="Current case personnel.">
          <div className="space-y-2">
            {team.map((member) => (
              <div key={member.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-sm font-medium text-slate-900">{member.name}</p>
                <p className="text-sm text-slate-500">{member.role}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Tags" description="Case markers and triage labels.">
        <div className="flex flex-wrap gap-2">
          {(caseItem.tags ?? []).map((tag) => (
            <span key={tag} className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">{tag}</span>
          ))}
        </div>
      </Card>

      <Card title="Case Statistics" description="Current workload snapshot.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
