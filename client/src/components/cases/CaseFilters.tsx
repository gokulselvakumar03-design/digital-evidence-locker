import type { CasePriority, CaseStatus } from '../../types';

interface CaseFiltersProps {
  status: 'ALL' | CaseStatus;
  priority: 'ALL' | CasePriority;
  sortBy: 'updated' | 'oldest' | 'newest';
  onStatusChange: (value: 'ALL' | CaseStatus) => void;
  onPriorityChange: (value: 'ALL' | CasePriority) => void;
  onSortChange: (value: 'updated' | 'oldest' | 'newest') => void;
}

export const CaseFilters = ({ status, priority, sortBy, onStatusChange, onPriorityChange, onSortChange }: CaseFiltersProps) => {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
      <label className="text-sm font-medium text-slate-700">
        <span className="mb-1 block">Status</span>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as 'ALL' | CaseStatus)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
        >
          <option value="ALL">All</option>
          <option value="OPEN">Open</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING_REVIEW">Pending Review</option>
          <option value="CLOSED">Closed</option>
        </select>
      </label>

      <label className="text-sm font-medium text-slate-700">
        <span className="mb-1 block">Priority</span>
        <select
          value={priority}
          onChange={(event) => onPriorityChange(event.target.value as 'ALL' | CasePriority)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
        >
          <option value="ALL">All</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </label>

      <label className="text-sm font-medium text-slate-700">
        <span className="mb-1 block">Sort</span>
        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as 'updated' | 'oldest' | 'newest')}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
        >
          <option value="updated">Recently Updated</option>
          <option value="oldest">Oldest</option>
          <option value="newest">Newest</option>
        </select>
      </label>
    </div>
  );
};
