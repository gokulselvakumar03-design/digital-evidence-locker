import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Evidence } from '../../types';

interface CaseEvidenceProps {
  evidence: Evidence[];
}

export const CaseEvidence = ({ evidence }: CaseEvidenceProps) => {
  return (
    <Card title="Evidence" description="Associated evidence files and review status.">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead>
            <tr className="text-xs uppercase tracking-[0.2em] text-slate-500">
              <th className="px-3 py-3">Evidence Name</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Uploaded By</th>
              <th className="px-3 py-3">Upload Date</th>
              <th className="px-3 py-3">Integrity Status</th>
              <th className="px-3 py-3">Review Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {evidence.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-4">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </td>
                <td className="px-3 py-4 text-sm text-slate-600">{item.type}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{item.uploadedBy ?? 'Unknown'}</td>
                <td className="px-3 py-4 text-sm text-slate-600">{item.uploadedAt}</td>
                <td className="px-3 py-4"><Badge tone={item.integrityStatus === 'Verified' ? 'emerald' : 'amber'}>{item.integrityStatus ?? 'Pending'}</Badge></td>
                <td className="px-3 py-4"><Badge tone={item.reviewStatus === 'Approved' ? 'emerald' : 'amber'}>{item.reviewStatus ?? 'Pending'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
