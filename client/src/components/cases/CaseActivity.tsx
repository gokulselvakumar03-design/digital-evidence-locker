import { Card } from '../ui/Card';
import type { Activity } from '../../types';

interface CaseActivityProps {
  activities: Activity[];
}

export const CaseActivity = ({ activities }: CaseActivityProps) => {
  return (
    <Card title="Activity" description="Audit-style activity feed for the matter.">
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-slate-900">{activity.title}</p>
              <span className="text-sm text-slate-400">{activity.timestamp}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{activity.detail}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{activity.actor}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
