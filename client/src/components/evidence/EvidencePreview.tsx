import { Card } from '../ui/Card';
import type { Evidence } from '../../types';

interface EvidencePreviewProps {
  evidence: Evidence;
}

export const EvidencePreview = ({ evidence }: EvidencePreviewProps) => {
  return (
    <Card title="Evidence Preview" description="Mock preview surface for secure evidence review.">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-900">{evidence.title}</p>
            <p className="text-sm text-slate-500">{evidence.fileName}</p>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">{evidence.type}</span>
        </div>
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          <p className="font-medium text-slate-700">Mock preview placeholder</p>
          <p className="mt-2">This frontend preview is intentionally non-functional and will later be replaced by backend-rendered media.</p>
        </div>
      </div>
    </Card>
  );
};
