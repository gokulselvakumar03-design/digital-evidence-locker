import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EvidenceTypeIcon } from './EvidenceTypeIcon';
import { EvidenceStatusBadge } from './EvidenceStatusBadge';
import type { Evidence } from '../../types';

interface EvidenceTableProps {
  evidence: Evidence[];
}

export const EvidenceTable = ({ evidence }: EvidenceTableProps) => {
  const navigate = useNavigate();
  const rows = useMemo(() => evidence, [evidence]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead>
          <tr className="text-xs uppercase tracking-[0.2em] text-slate-500">
            <th className="px-3 py-3">Evidence</th>
            <th className="px-3 py-3">Evidence ID</th>
            <th className="px-3 py-3">Case</th>
            <th className="px-3 py-3">Type</th>
            <th className="px-3 py-3">Uploaded By</th>
            <th className="px-3 py-3">Uploaded Date</th>
            <th className="px-3 py-3">File Size</th>
            <th className="px-3 py-3">Integrity</th>
            <th className="px-3 py-3">Review Status</th>
            <th className="px-3 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((item) => (
            <tr key={item.id} className="cursor-pointer transition hover:bg-slate-50" onClick={() => navigate(`/evidence/${item.id}`)}>
              <td className="px-3 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                    <EvidenceTypeIcon type={item.type} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.fileName}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-4 text-sm text-slate-600">{item.evidenceNumber}</td>
              <td className="px-3 py-4 text-sm text-slate-600">{item.caseId.toUpperCase()}</td>
              <td className="px-3 py-4 text-sm text-slate-600">{item.type}</td>
              <td className="px-3 py-4 text-sm text-slate-600">{item.uploadedBy}</td>
              <td className="px-3 py-4 text-sm text-slate-600">{item.uploadedAt}</td>
              <td className="px-3 py-4 text-sm text-slate-600">{item.fileSize}</td>
              <td className="px-3 py-4"><EvidenceStatusBadge integrityStatus={item.integrityStatus} reviewStatus={item.reviewStatus} /></td>
              <td className="px-3 py-4 text-sm text-slate-600">{item.reviewStatus}</td>
              <td className="px-3 py-4">
                <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600" onClick={(event) => { event.stopPropagation(); navigate(`/evidence/${item.id}`); }}>
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
