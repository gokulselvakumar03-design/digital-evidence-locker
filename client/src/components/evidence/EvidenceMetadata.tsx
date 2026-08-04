import { Card } from '../ui/Card';
import type { Evidence } from '../../types';

interface EvidenceMetadataProps {
  evidence: Evidence;
}

export const EvidenceMetadata = ({ evidence }: EvidenceMetadataProps) => {
  return (
    <Card title="Evidence Metadata" description="Operational details associated with the evidence.">
      <dl className="grid gap-4 md:grid-cols-2 text-sm text-slate-600">
        <div>
          <dt className="font-medium text-slate-700">File Name</dt>
          <dd className="mt-1">{evidence.fileName}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">File Type</dt>
          <dd className="mt-1">{evidence.type}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">File Size</dt>
          <dd className="mt-1">{evidence.fileSize}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Uploaded By</dt>
          <dd className="mt-1">{evidence.uploadedBy}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Uploaded At</dt>
          <dd className="mt-1">{evidence.uploadedAt}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Collected At</dt>
          <dd className="mt-1">{evidence.collectedAt ?? 'Not recorded'}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Source</dt>
          <dd className="mt-1">{evidence.source ?? 'Not recorded'}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Associated Case</dt>
          <dd className="mt-1">{evidence.caseId.toUpperCase()}</dd>
        </div>
      </dl>
    </Card>
  );
};
