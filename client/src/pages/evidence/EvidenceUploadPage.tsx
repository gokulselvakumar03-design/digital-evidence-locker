import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { mockCases } from '../../data/mockData';

const EvidenceUploadPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCaseId, setSelectedCaseId] = useState<string>((new URLSearchParams(location.search).get('caseId') ?? '').toString());
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('No file selected');
  const [fileType, setFileType] = useState('Unknown');
  const [fileSize, setFileSize] = useState('0 MB');
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const cases = useMemo(() => mockCases, []);

  const simulateUpload = () => {
    setProgress(10);
    window.setTimeout(() => setProgress(35), 300);
    window.setTimeout(() => setProgress(70), 600);
    window.setTimeout(() => setProgress(100), 900);
    setSuccessMessage('Mock upload completed. Evidence is ready for review.');
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setFileType(file.type || 'Unknown');
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(0)} MB`);
      simulateUpload();
    }
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileType(file.type || 'Unknown');
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(0)} MB`);
      simulateUpload();
    }
  };

  return (
    <AppLayout title="Upload Evidence">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Upload Evidence</h1>
        <p className="mt-1 text-sm text-slate-500">Create a mock upload workflow and associate evidence with a legal case.</p>
      </div>

      {successMessage ? <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div> : null}

      <div className="space-y-6">
        <Card title="Step 1 — Select Case" description="Choose the legal matter this evidence belongs to.">
          <label className="text-sm font-medium text-slate-700">
            <span className="mb-1.5 block">Related Case</span>
            <select value={selectedCaseId} onChange={(event) => setSelectedCaseId(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500">
              <option value="">Select a case</option>
              {cases.map((item) => (
                <option key={item.id} value={item.id}>{item.caseNumber} — {item.title}</option>
              ))}
            </select>
          </label>
        </Card>

        <Card title="Step 2 — Evidence File" description="Upload a file mock and preview the staged upload state.">
          <div
            onDragOver={(event) => { event.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50'}`}
          >
            <UploadCloud className="mx-auto text-indigo-600" size={28} />
            <p className="mt-3 font-medium text-slate-900">Drag and drop evidence files here</p>
            <p className="mt-2 text-sm text-slate-500">Images, videos, audio, documents, screenshots, or other files.</p>
            <label className="mt-4 inline-flex cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
              Choose file
              <input type="file" className="hidden" onChange={handleFileSelection} />
            </label>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-medium text-slate-900">Selected file</p>
            <p className="mt-1 text-sm text-slate-600">File name: {fileName}</p>
            <p className="text-sm text-slate-600">File type: {fileType}</p>
            <p className="text-sm text-slate-600">File size: {fileSize}</p>
            <div className="mt-4 h-2 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-sm text-slate-500">Upload progress simulation: {progress}%</p>
          </div>
        </Card>

        <Card title="Step 3 — Evidence Information" description="Capture the core metadata for the evidence record.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Evidence Title" placeholder="Enter evidence title" />
            <Input label="Evidence Type" placeholder="Video" />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-1.5 block">Description</span>
                <textarea rows={4} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Describe the evidence context" />
              </label>
            </div>
            <Input label="Date Collected" type="date" />
            <Input label="Location Collected" placeholder="Interview Room" />
            <Input label="Source" placeholder="Security Camera" />
            <Input label="Tags" placeholder="Video, Surveillance, Entry" />
          </div>
        </Card>

        <Card title="Step 4 — Integrity Information" description="Display the mock integrity workflow and security metadata.">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-900">SHA-256 verification will be generated when evidence is securely uploaded.</p>
            <p className="mt-2 text-sm text-slate-600">This mock view clearly marks generated values as simulated and will be replaced by backend-generated verification later.</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-medium text-slate-900">SHA-256 Hash</p>
                <p className="mt-2 break-all font-mono text-xs text-slate-500">mock-sha256-abc123def4567890...</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-medium text-slate-900">Integrity Status</p>
                <p className="mt-2 text-sm text-slate-600">PENDING</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Step 5 — Confirmation" description="Review the staged evidence metadata before submission.">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-medium text-slate-900">Evidence summary</p>
            <p className="mt-2 text-sm text-slate-600">Case: {selectedCaseId ? cases.find((item) => item.id === selectedCaseId)?.caseNumber : 'Not selected'}</p>
            <p className="text-sm text-slate-600">File: {fileName}</p>
            <p className="text-sm text-slate-600">Upload progress: {progress}%</p>
          </div>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => navigate('/evidence')}>Cancel</Button>
          <Button variant="secondary">Save Draft</Button>
          <Button onClick={() => { setSuccessMessage('Mock evidence upload completed.'); navigate('/evidence'); }}>Upload Evidence</Button>
        </div>
      </div>
    </AppLayout>
  );
  };

export default EvidenceUploadPage;
