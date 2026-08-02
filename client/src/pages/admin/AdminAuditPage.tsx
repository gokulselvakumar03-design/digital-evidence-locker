import { useMemo, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { mockAdminAuditLogs } from '../../data/mockData';

const AdminAuditPage = () => {
  const [dateFilter, setDateFilter] = useState('All Dates');
  const [userFilter, setUserFilter] = useState('All Users');
  const [actionFilter, setActionFilter] = useState('All Actions');
  const [severityFilter, setSeverityFilter] = useState('All Severities');

  const filteredLogs = useMemo(() => {
    return mockAdminAuditLogs.filter((entry) => {
      const matchesDate = dateFilter === 'All Dates' || entry.timestamp.includes(dateFilter === 'Today' ? '2026-07-31' : '2026-07-30');
      const matchesUser = userFilter === 'All Users' || entry.user === userFilter;
      const matchesAction = actionFilter === 'All Actions' || entry.action === actionFilter;
      const matchesSeverity = severityFilter === 'All Severities' || entry.severity === severityFilter;
      return matchesDate && matchesUser && matchesAction && matchesSeverity;
    });
  }, [actionFilter, dateFilter, severityFilter, userFilter]);

  const users = ['All Users', ...new Set(mockAdminAuditLogs.map((entry) => entry.user))];
  const actions = ['All Actions', ...new Set(mockAdminAuditLogs.map((entry) => entry.action))];
  const severities = ['All Severities', ...new Set(mockAdminAuditLogs.map((entry) => entry.severity))];

  return (
    <AppLayout title="Admin Audit">
      <PageHeader title="Audit logs" description="Review governance events, access changes, and platform activity across the legal evidence environment." />

      <Card>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm text-slate-600">
            <span className="mb-1.5 block font-medium text-slate-700">Date</span>
            <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              <option>All Dates</option>
              <option>Today</option>
              <option>Yesterday</option>
            </select>
          </label>
          <label className="block text-sm text-slate-600">
            <span className="mb-1.5 block font-medium text-slate-700">User</span>
            <select value={userFilter} onChange={(event) => setUserFilter(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              {users.map((user) => <option key={user} value={user}>{user}</option>)}
            </select>
          </label>
          <label className="block text-sm text-slate-600">
            <span className="mb-1.5 block font-medium text-slate-700">Action</span>
            <select value={actionFilter} onChange={(event) => setActionFilter(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              {actions.map((action) => <option key={action} value={action}>{action}</option>)}
            </select>
          </label>
          <label className="block text-sm text-slate-600">
            <span className="mb-1.5 block font-medium text-slate-700">Severity</span>
            <select value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              {severities.map((severity) => <option key={severity} value={severity}>{severity}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-3 py-3 font-medium">Timestamp</th>
                <th className="px-3 py-3 font-medium">User</th>
                <th className="px-3 py-3 font-medium">Role</th>
                <th className="px-3 py-3 font-medium">Action</th>
                <th className="px-3 py-3 font-medium">Target</th>
                <th className="px-3 py-3 font-medium">IP Address</th>
                <th className="px-3 py-3 font-medium">Severity</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((entry) => (
                <tr key={entry.id} className="border-b border-slate-100 align-top">
                  <td className="px-3 py-3 text-slate-700">{entry.timestamp}</td>
                  <td className="px-3 py-3 font-medium text-slate-900">{entry.user}</td>
                  <td className="px-3 py-3 text-slate-700">{entry.role}</td>
                  <td className="px-3 py-3 text-slate-700">{entry.action}</td>
                  <td className="px-3 py-3 text-slate-700">{entry.target}</td>
                  <td className="px-3 py-3 text-slate-700">{entry.ipAddress}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${entry.severity === 'Critical' ? 'bg-rose-50 text-rose-700' : entry.severity === 'High' ? 'bg-amber-50 text-amber-700' : entry.severity === 'Medium' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>{entry.severity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  );
};

export default AdminAuditPage;
