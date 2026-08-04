import { Card } from '../ui/Card';
import type { CustodyEvent } from '../../types';

interface ChainOfCustodyProps {
  events: CustodyEvent[];
}

export const ChainOfCustody = ({ events }: ChainOfCustodyProps) => {
  return (
    <Card title="Chain of Custody" description="Display-only custody history for secure evidence handling.">
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-slate-900">{event.action}</p>
              <span className="text-sm text-slate-400">{event.date} • {event.time}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{event.performedBy} — {event.role}</p>
            {event.location ? <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{event.location}</p> : null}
          </div>
        ))}
      </div>
    </Card>
  );
};
