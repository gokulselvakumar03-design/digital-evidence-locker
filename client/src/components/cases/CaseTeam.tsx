import { Card } from '../ui/Card';
import type { CaseTeamMember } from '../../types';

interface CaseTeamProps {
  members: CaseTeamMember[];
}

export const CaseTeam = ({ members }: CaseTeamProps) => {
  return (
    <Card title="Team" description="People currently associated with the case.">
      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-slate-900">{member.name}</p>
                <p className="text-sm text-slate-500">{member.role}</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">{member.permission}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">{member.email}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
