import { Card } from '../ui/Card';
import type { CaseTimelineEvent } from '../../types';

interface CaseTimelineProps {
  events: CaseTimelineEvent[];
}

export const CaseTimeline = ({ events }: CaseTimelineProps) => {
  return (
    <Card title="Timeline" description="Chronological case activity and milestones.">
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-600" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{event.title}</p>
                <span className="text-sm text-slate-400">{event.timestamp}</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{event.detail}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{event.actor}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
