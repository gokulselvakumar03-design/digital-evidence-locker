import type { EvidenceType, IntegrityStatus, ReviewStatus } from '../../types';

interface EvidenceFiltersProps {
  typeFilter: 'ALL' | EvidenceType;
  integrityFilter: 'ALL' | IntegrityStatus;
  reviewFilter: 'ALL' | ReviewStatus;
  sortBy: 'uploaded' | 'oldest' | 'name' | 'size';
  onTypeChange: (value: 'ALL' | EvidenceType) => void;
  onIntegrityChange: (value: 'ALL' | IntegrityStatus) => void;
  onReviewChange: (value: 'ALL' | ReviewStatus) => void;
  onSortChange: (value: 'uploaded' | 'oldest' | 'name' | 'size') => void;
}

export const EvidenceFilters = ({ typeFilter, integrityFilter, reviewFilter, sortBy, onTypeChange, onIntegrityChange, onReviewChange, onSortChange }: EvidenceFiltersProps) => {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
      <label className="text-sm font-medium text-slate-700">
        <span className="mb-1 block">Evidence Type</span>
        <select value={typeFilter} onChange={(event) => onTypeChange(event.target.value as 'ALL' | EvidenceType)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500">
          <option value="ALL">All</option>
          <option value="IMAGE">Image</option>
          <option value="VIDEO">Video</option>
          <option value="AUDIO">Audio</option>
          <option value="DOCUMENT">Document</option>
          <option value="SCREENSHOT">Screenshot</option>
          <option value="EMAIL">Email</option>
          <option value="OTHER">Other</option>
        </select>
      </label>

      <label className="text-sm font-medium text-slate-700">
        <span className="mb-1 block">Integrity</span>
        <select value={integrityFilter} onChange={(event) => onIntegrityChange(event.target.value as 'ALL' | IntegrityStatus)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500">
          <option value="ALL">All</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="FLAGGED">Flagged</option>
        </select>
      </label>

      <label className="text-sm font-medium text-slate-700">
        <span className="mb-1 block">Review Status</span>
        <select value={reviewFilter} onChange={(event) => onReviewChange(event.target.value as 'ALL' | ReviewStatus)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500">
          <option value="ALL">All</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="PENDING_REVIEW">Pending Review</option>
          <option value="FLAGGED">Flagged</option>
        </select>
      </label>

      <label className="text-sm font-medium text-slate-700">
        <span className="mb-1 block">Sort</span>
        <select value={sortBy} onChange={(event) => onSortChange(event.target.value as 'uploaded' | 'oldest' | 'name' | 'size')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500">
          <option value="uploaded">Recently Uploaded</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name</option>
          <option value="size">File Size</option>
        </select>
      </label>
    </div>
  );
};
