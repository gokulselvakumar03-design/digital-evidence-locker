import { useMemo, useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { mockAdminUsers } from '../../data/mockData';

const roleOptions = ['All Roles', ...new Set(mockAdminUsers.map((user) => user.role))];
const statusOptions = ['All Statuses', ...new Set(mockAdminUsers.map((user) => user.status))];

const AdminUsersPage = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    return mockAdminUsers.filter((user) => {
      const matchesSearch = [user.name, user.email, user.department].join(' ').toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'All Statuses' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, search, statusFilter]);

  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <AppLayout title="Admin Users">
      <PageHeader
        title="User management"
        description="Maintain staff access, roles, and platform identities across the evidence system."
        action={<Button>Add User</Button>}
      />

      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="block text-sm text-slate-600">
            <span className="mb-1.5 block font-medium text-slate-700">Search</span>
            <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search users" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </label>
          <label className="block text-sm text-slate-600">
            <span className="mb-1.5 block font-medium text-slate-700">Role</span>
            <select value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setPage(1); }} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
          </label>
          <label className="block text-sm text-slate-600">
            <span className="mb-1.5 block font-medium text-slate-700">Status</span>
            <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-3 py-3 font-medium">Avatar</th>
                <th className="px-3 py-3 font-medium">Name</th>
                <th className="px-3 py-3 font-medium">Email</th>
                <th className="px-3 py-3 font-medium">Role</th>
                <th className="px-3 py-3 font-medium">Department</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Joined</th>
                <th className="px-3 py-3 font-medium">Last Login</th>
                <th className="px-3 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 align-middle">
                  <td className="px-3 py-3">
                    <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                  </td>
                  <td className="px-3 py-3 font-medium text-slate-900">{user.name}</td>
                  <td className="px-3 py-3 text-slate-600">{user.email}</td>
                  <td className="px-3 py-3 text-slate-700">{user.role}</td>
                  <td className="px-3 py-3 text-slate-700">{user.department}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : user.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-700">{user.joined}</td>
                  <td className="px-3 py-3 text-slate-700">{user.lastLogin}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"><Eye size={12} />View</button>
                      <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"><Pencil size={12} />Edit</button>
                      <button type="button" className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">Disable</button>
                      <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100"><Trash2 size={12} />Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing {filteredUsers.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} users</p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1}>Previous</Button>
            <Button variant="secondary" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={currentPage === pageCount}>Next</Button>
          </div>
        </div>
      </Card>
    </AppLayout>
  );
};

export default AdminUsersPage;
