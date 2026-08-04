import { useMemo } from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { Case } from '../../types';

interface CaseTableProps {
  cases: Case[];
  onSelect: (caseId: string) => void;
}

const statusTone: Record<Case['status'], 'indigo' | 'emerald' | 'amber' | 'slate'> = {
  ACTIVE: 'emerald',
  PENDING_REVIEW: 'amber',
  OPEN: 'indigo',
  CLOSED: 'slate',
};

const priorityTone: Record<Case['priority'], 'indigo' | 'amber' | 'rose' | 'slate'> = {
  LOW: 'slate',
  MEDIUM: 'indigo',
  HIGH: 'amber',
  CRITICAL: 'rose',
};

export const CaseTable = ({ cases, onSelect }: CaseTableProps) => {
  const rows = useMemo(() => cases, [cases]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead>
          <tr className="text-xs uppercase tracking-[0.2em] text-slate-500">
            <th className="px-3 py-3">Case</th>
            <th className="px-3 py-3">Type</th>
            <th className="px-3 py-3">Assigned To</th>
            <th className="px-3 py-3">Created</th>
            <th className="px-3 py-3">Updated</th>
            <th className="px-3 py-3">Priority</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Evidence</th>
            <th className="px-3 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((item) => (
            <tr key={item.id} className="cursor-pointer transition hover:bg-slate-50" onClick={() => onSelect(item.id)}>
              <td className="px-3 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{item.caseNumber}</p>
                    <p className="text-sm text-slate-500">{item.title}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-4 text-sm text-slate-600">{item.type ?? 'General'}</td>
              <td className="px-3 py-4 text-sm text-slate-600">{item.assignedTo}</td>
              <td className="px-3 py-4 text-sm text-slate-600">{item.createdAt}</td>
              <td className="px-3 py-4 text-sm text-slate-600">{item.updatedAt}</td>
              <td className="px-3 py-4"><Badge tone={priorityTone[item.priority]}>{item.priority}</Badge></td>
              <td className="px-3 py-4"><Badge tone={statusTone[item.status]}>{item.status}</Badge></td>
              <td className="px-3 py-4 text-sm text-slate-600">{item.evidenceCount} Evidence Files</td>
              <td className="px-3 py-4">
                <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600" onClick={(event) => { event.stopPropagation(); onSelect(item.id); }}>
                  Open <ArrowRight size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
