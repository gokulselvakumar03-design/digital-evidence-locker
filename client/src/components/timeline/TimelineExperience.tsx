import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  BriefcaseBusiness,
  CheckCheck,
  ChevronRight,
  CircleDashed,
  FileText,
  Lock,
  MessageSquareText,
  Search,
  ShieldAlert,
  UserRound,
  X,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { AuditTrail } from './AuditTrail';
import type { AuditEvent, Case, Evidence, User } from '../../types';

export type GlobalTimelineFilter = 'ALL' | 'CASE' | 'EVIDENCE' | 'INTEGRITY' | 'CUSTODY' | 'REVIEW' | 'COMMENT' | 'SECURITY';
export type CaseTimelineFilter = 'ALL' | 'CASE' | 'EVIDENCE' | 'REVIEW' | 'ACTIVITY';

type ViewMode = 'timeline' | 'table';

type EventTypeFilter = GlobalTimelineFilter | CaseTimelineFilter;

interface TimelineExperienceProps {
  events: AuditEvent[];
  cases: Case[];
  users: User[];
  evidence?: Evidence[];
  caseScoped?: boolean;
  showHeader?: boolean;
}

const typeOptions: Array<{ value: EventTypeFilter; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'CASE', label: 'Case' },
  { value: 'EVIDENCE', label: 'Evidence' },
  { value: 'INTEGRITY', label: 'Integrity' },
  { value: 'CUSTODY', label: 'Custody' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'COMMENT', label: 'Comment' },
  { value: 'SECURITY', label: 'Security' },
];

const caseTypeOptions: Array<{ value: CaseTimelineFilter; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'CASE', label: 'Case' },
  { value: 'EVIDENCE', label: 'Evidence' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'ACTIVITY', label: 'Activity' },
];

const dateOptions = [
  { value: 'TODAY', label: 'Today' },
  { value: 'LAST_7_DAYS', label: 'Last 7 Days' },
  { value: 'LAST_30_DAYS', label: 'Last 30 Days' },
  { value: 'CUSTOM', label: 'Custom' },
] as const;

const severityStyles: Record<string, 'indigo' | 'slate' | 'emerald' | 'amber' | 'rose'> = {
  INFO: 'slate',
  LOW: 'indigo',
  MEDIUM: 'amber',
  HIGH: 'rose',
};

const getEventTypeLabel = (event: AuditEvent): string => {
  if (event.type === 'CASE') return 'Case';
  if (event.type === 'EVIDENCE') return 'Evidence';
  if (event.type === 'INTEGRITY') return 'Integrity';
  if (event.type === 'CUSTODY') return 'Custody';
  if (event.type === 'REVIEW') return 'Review';
  if (event.type === 'COMMENT') return 'Comment';
  return 'Security';
};

const eventTypeMatchesCaseFilter = (event: AuditEvent, filter: CaseTimelineFilter) => {
  if (filter === 'ALL') return true;
  if (filter === 'CASE') return event.type === 'CASE';
  if (filter === 'EVIDENCE') return event.type === 'EVIDENCE';
  if (filter === 'REVIEW') return event.type === 'REVIEW';
  if (filter === 'ACTIVITY') return true;
  return false;
};

const eventTypeMatchesFilter = (event: AuditEvent, filter: EventTypeFilter) => {
  if (filter === 'ALL') return true;
  return event.type === filter;
};

const getEventIcon = (event: AuditEvent) => {
  switch (event.type) {
    case 'CASE':
      return BriefcaseBusiness;
    case 'EVIDENCE':
      return FileText;
    case 'SECURITY':
      return ShieldAlert;
    case 'INTEGRITY':
      return CheckCheck;
    case 'REVIEW':
      return CircleDashed;
    case 'COMMENT':
      return MessageSquareText;
    case 'CUSTODY':
      return Lock;
    default:
      return Activity;
  }
};

const getDateGroup = (timestamp: string) => {
  const current = new Date();
  const target = new Date(timestamp);
  const todayStart = new Date(current.getFullYear(), current.getMonth(), current.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

  if (target >= todayStart) return 'TODAY';
  if (target >= yesterdayStart && target < todayStart) return 'YESTERDAY';
  return target.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
};

const formatDate = (timestamp: string) => new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export const TimelineExperience = ({ events, cases, users, evidence = [], caseScoped = false, showHeader = true }: TimelineExperienceProps) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<EventTypeFilter>(caseScoped ? 'ALL' : 'ALL');
  const [dateFilter, setDateFilter] = useState<'TODAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'CUSTOM'>('LAST_7_DAYS');
  const [selectedCase, setSelectedCase] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  const caseLookup = useMemo(() => Object.fromEntries(cases.map((item) => [item.id, item])), [cases]);
  const evidenceLookup = useMemo(() => Object.fromEntries(evidence.map((item) => [item.id, item])), [evidence]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventTypeMatches = caseScoped ? eventTypeMatchesCaseFilter(event, typeFilter as CaseTimelineFilter) : eventTypeMatchesFilter(event, typeFilter as GlobalTimelineFilter);
      if (!eventTypeMatches) return false;

      if (search) {
        const haystack = `${event.title} ${event.description} ${event.user} ${event.role} ${caseLookup[event.caseId ?? '']?.caseNumber ?? ''} ${event.evidenceId ?? ''} ${event.action}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }

      if (dateFilter !== 'CUSTOM') {
        const eventDate = new Date(event.timestamp);
        const today = new Date();
        const diffDays = (today.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24);

        if (dateFilter === 'TODAY' && eventDate.toDateString() !== today.toDateString()) return false;
        if (dateFilter === 'LAST_7_DAYS' && diffDays > 7) return false;
        if (dateFilter === 'LAST_30_DAYS' && diffDays > 30) return false;
      }

      if (selectedCase !== 'ALL' && event.caseId !== selectedCase) return false;
      if (selectedUser !== 'ALL' && event.user !== selectedUser) return false;

      return true;
    });
  }, [caseLookup, dateFilter, events, search, selectedCase, selectedUser, typeFilter, caseScoped]);

  const grouped = useMemo(() => {
    return filteredEvents.reduce<Record<string, AuditEvent[]>>((groups, event) => {
      const key = getDateGroup(event.timestamp);
      groups[key] = groups[key] ?? [];
      groups[key].push(event);
      return groups;
    }, {});
  }, [filteredEvents]);

  const totalToday = useMemo(() => events.filter((event) => new Date(event.timestamp).toDateString() === new Date().toDateString()).length, [events]);
  const evidenceActivityCount = useMemo(() => events.filter((event) => event.type === 'EVIDENCE').length, [events]);
  const caseUpdateCount = useMemo(() => events.filter((event) => event.type === 'CASE').length, [events]);
  const securityEventCount = useMemo(() => events.filter((event) => event.type === 'SECURITY').length, [events]);

  const enabledTypeOptions = caseScoped ? caseTypeOptions : typeOptions;
  const activeType = typeFilter as EventTypeFilter;

  return (
    <div className="space-y-6">
      {showHeader ? (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-indigo-600">Platform activity</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Timeline</h1>
            <p className="mt-2 text-sm text-slate-500">Track case, evidence, review, and custody activity across the platform.</p>
          </div>
          <Button variant="secondary" className="w-full md:w-auto">
            <span className="flex items-center gap-2"><Search size={16} /> Export Log</span>
          </Button>
        </div>
      ) : null}

      {!caseScoped ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Events Today', value: totalToday },
            { label: 'Evidence Activities', value: evidenceActivityCount },
            { label: 'Case Updates', value: caseUpdateCount },
            { label: 'Security Events', value: securityEventCount },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      <Card className="overflow-hidden">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search events, cases, evidence, or users"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant={viewMode === 'timeline' ? 'primary' : 'secondary'} onClick={() => setViewMode('timeline')} className="px-3 py-2">
              Timeline View
            </Button>
            <Button variant={viewMode === 'table' ? 'primary' : 'secondary'} onClick={() => setViewMode('table')} className="px-3 py-2">
              Table View
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm text-slate-600">
            <span className="mb-1.5 block font-medium text-slate-700">Event Type</span>
            <select value={activeType} onChange={(event) => setTypeFilter(event.target.value as EventTypeFilter)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              {enabledTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-slate-600">
            <span className="mb-1.5 block font-medium text-slate-700">Date</span>
            <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value as 'TODAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'CUSTOM')} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              {dateOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-slate-600">
            <span className="mb-1.5 block font-medium text-slate-700">Case</span>
            <select value={selectedCase} onChange={(event) => setSelectedCase(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              <option value="ALL">All Cases</option>
              {cases.map((item) => (
                <option key={item.id} value={item.id}>{item.caseNumber}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-slate-600">
            <span className="mb-1.5 block font-medium text-slate-700">User</span>
            <select value={selectedUser} onChange={(event) => setSelectedUser(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              <option value="ALL">All Users</option>
              {users.map((item) => (
                <option key={item.id} value={`${item.firstName} ${item.lastName}`}>{`${item.firstName} ${item.lastName}`}</option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      {viewMode === 'timeline' ? (
        <div className="space-y-6">
          {Object.entries(grouped).length ? Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{group}</p>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="space-y-4">
                {items.map((event, index) => {
                  const Icon = getEventIcon(event);
                  const associatedCase = event.caseId ? caseLookup[event.caseId] : undefined;
                  const associatedEvidence = event.evidenceId ? evidenceLookup[event.evidenceId] : undefined;

                  return (
                    <div key={event.id} className="relative flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${event.type === 'SECURITY' ? 'bg-rose-50 text-rose-600' : event.type === 'INTEGRITY' ? 'bg-emerald-50 text-emerald-600' : event.type === 'CASE' ? 'bg-indigo-50 text-indigo-600' : event.type === 'EVIDENCE' ? 'bg-sky-50 text-sky-600' : event.type === 'REVIEW' ? 'bg-amber-50 text-amber-600' : event.type === 'COMMENT' ? 'bg-violet-50 text-violet-600' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon size={18} />
                        </div>
                        {index < items.length - 1 ? <div className="mt-2 h-full w-px bg-slate-200" /> : null}
                      </div>

                      <button type="button" onClick={() => setSelectedEvent(event)} className="flex-1 text-left">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-base font-semibold text-slate-900">{event.title}</p>
                              <Badge tone={severityStyles[event.severity ?? 'INFO'] ?? 'slate'}>{event.severity ?? 'INFO'}</Badge>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                              <span>{formatDate(event.timestamp)}</span>
                              <span>•</span>
                              <span>{getEventTypeLabel(event)}</span>
                            </div>
                          </div>
                          <div className="text-sm text-slate-500">{associatedCase ? associatedCase.caseNumber : associatedEvidence ? associatedEvidence.evidenceNumber : event.action}</div>
                        </div>

                        <p className="mt-3 text-sm text-slate-600">{event.description}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1"><UserRound size={12} /> {event.user}</span>
                          <span>•</span>
                          <span>{event.role}</span>
                          {associatedEvidence ? <span>•</span> : null}
                          {associatedEvidence ? <span>{associatedEvidence.title}</span> : null}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {associatedCase ? (
                            <button type="button" onClick={(eventClick) => { eventClick.stopPropagation(); navigate(`/cases/${associatedCase.id}`); }} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                              View Case <ChevronRight size={12} />
                            </button>
                          ) : null}
                          {associatedEvidence ? (
                            <button type="button" onClick={(eventClick) => { eventClick.stopPropagation(); navigate(`/evidence/${associatedEvidence.id}`); }} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                              View Evidence <ChevronRight size={12} />
                            </button>
                          ) : null}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )) : <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">No timeline events match the current filters.</div>}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <AuditTrail events={filteredEvents} cases={cases} />
        </div>
      )}

      {selectedEvent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-indigo-600">{getEventTypeLabel(selectedEvent)}</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{selectedEvent.title}</h3>
              </div>
              <button type="button" onClick={() => setSelectedEvent(null)} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500">
                <X size={16} />
              </button>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              <Badge tone={severityStyles[selectedEvent.severity ?? 'INFO'] ?? 'slate'}>{selectedEvent.severity ?? 'INFO'}</Badge>
              <Badge tone="indigo">{selectedEvent.action}</Badge>
            </div>

            <dl className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Event</dt><dd className="mt-1 text-sm font-medium text-slate-900">{selectedEvent.title}</dd></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Event ID</dt><dd className="mt-1 text-sm font-medium text-slate-900">{selectedEvent.id}</dd></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Timestamp</dt><dd className="mt-1 text-sm font-medium text-slate-900">{new Date(selectedEvent.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</dd></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Performed By</dt><dd className="mt-1 text-sm font-medium text-slate-900">{selectedEvent.user}</dd></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Role</dt><dd className="mt-1 text-sm font-medium text-slate-900">{selectedEvent.role}</dd></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Associated Case</dt><dd className="mt-1 text-sm font-medium text-slate-900">{selectedEvent.caseId ? caseLookup[selectedEvent.caseId]?.caseNumber ?? selectedEvent.caseId : '—'}</dd></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Associated Evidence</dt><dd className="mt-1 text-sm font-medium text-slate-900">{selectedEvent.evidenceId ? evidenceLookup[selectedEvent.evidenceId]?.title ?? selectedEvent.evidenceId : '—'}</dd></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Action</dt><dd className="mt-1 text-sm font-medium text-slate-900">{selectedEvent.action}</dd></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 md:col-span-2"><dt className="text-xs uppercase tracking-[0.2em] text-slate-400">Description</dt><dd className="mt-1 text-sm text-slate-700">{selectedEvent.description}</dd></div>
            </dl>

            {(selectedEvent.ipAddress || selectedEvent.device || selectedEvent.location) ? (
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {selectedEvent.ipAddress ? <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">IP Address</p><p className="mt-1 text-sm font-medium text-slate-900">{selectedEvent.ipAddress}</p></div> : null}
                {selectedEvent.device ? <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Device</p><p className="mt-1 text-sm font-medium text-slate-900">{selectedEvent.device}</p></div> : null}
                {selectedEvent.location ? <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Location</p><p className="mt-1 text-sm font-medium text-slate-900">{selectedEvent.location}</p></div> : null}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2">
              {selectedEvent.caseId ? <Button variant="secondary" onClick={() => { navigate(`/cases/${selectedEvent.caseId}`); setSelectedEvent(null); }}>View Case</Button> : null}
              {selectedEvent.evidenceId ? <Button variant="secondary" onClick={() => { navigate(`/evidence/${selectedEvent.evidenceId}`); setSelectedEvent(null); }}>View Evidence</Button> : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
