import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { Evidence } from '../../types';

interface IntegrityPanelProps {
  evidence: Evidence;
}

export const IntegrityPanel = ({ evidence }: IntegrityPanelProps) => {
  const [status, setStatus] = useState<'Checking...' | 'Verified'>('Verified');

  const handleVerify = () => {
    setStatus('Checking...');
    window.setTimeout(() => setStatus('Verified'), 700);
  };

  return (
    <Card title="Integrity Verification" description="Mock integrity verification view for secure evidence handling.">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600"><ShieldCheck size={18} /></div>
          <div>
            <p className="font-semibold text-slate-900">Integrity Status: {evidence.integrityStatus}</p>
            <p className="mt-1 text-sm text-slate-600">This frontend simulates verification only. Actual cryptographic validation will be handled by the backend.</p>
          </div>
        </div>

        <dl className="mt-5 grid gap-4 md:grid-cols-2 text-sm text-slate-600">
          <div>
            <dt className="font-medium text-slate-700">SHA-256 Hash</dt>
            <dd className="mt-1 break-all font-mono text-xs">{evidence.sha256Hash ?? 'Simulated hash placeholder'}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-700">Original Hash</dt>
            <dd className="mt-1 font-mono text-xs">{evidence.sha256Hash ?? 'Simulated original hash'}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-700">Current Hash</dt>
            <dd className="mt-1 font-mono text-xs">{evidence.sha256Hash ?? 'Simulated current hash'}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-700">Last Verified</dt>
            <dd className="mt-1">{evidence.uploadedAt}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-700">Verification Method</dt>
            <dd className="mt-1">Mock verification workflow</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-700">Status</dt>
            <dd className="mt-1">{status}</dd>
          </div>
        </dl>

        <div className="mt-5">
          <Button type="button" onClick={handleVerify}>Verify Integrity</Button>
        </div>
      </div>
    </Card>
  );
};
