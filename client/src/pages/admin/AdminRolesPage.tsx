import { useMemo, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { mockAdminRoles } from '../../data/mockData';

const AdminRolesPage = () => {
  const [roles, setRoles] = useState(mockAdminRoles);
  const [selectedRoleId, setSelectedRoleId] = useState(mockAdminRoles[0].id);

  const selectedRole = useMemo(() => roles.find((role) => role.id === selectedRoleId) ?? roles[0], [roles, selectedRoleId]);

  const togglePermission = (permission: string) => {
    setRoles((current) => current.map((role) => {
      if (role.id !== selectedRoleId) return role;

      const nextPermissions = role.permissions.includes(permission)
        ? role.permissions.filter((item) => item !== permission)
        : [...role.permissions, permission];

      return { ...role, permissions: nextPermissions };
    }));
  };

  return (
    <AppLayout title="Admin Roles">
      <PageHeader title="Role management" description="Review system roles and adjust access permissions through the mock admin console." />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card title="Roles" description="Available user roles in the platform.">
          <div className="space-y-3">
            {roles.map((role) => (
              <button type="button" key={role.id} onClick={() => setSelectedRoleId(role.id)} className={`w-full rounded-xl border p-4 text-left transition ${selectedRole.id === role.id ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{role.name}</p>
                    <p className="text-sm text-slate-500">{role.description}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${role.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>{role.active ? 'Active' : 'Inactive'}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card title={`Permissions for ${selectedRole.name}`} description="Mock role configuration panel.">
          <div className="grid gap-3 md:grid-cols-2">
            {['Cases: Read, Write, Delete, Approve', 'Evidence: Read, Write, Delete, Approve', 'Timeline: Read, Write, Delete, Approve', 'Analytics: Read, Write', 'Notifications: Read, Write', 'Users: Read, Write, Delete', 'Settings: Read, Write', 'AI: Read'].map((permission) => {
              const active = selectedRole.permissions.includes(permission);
              return (
                <button type="button" key={permission} onClick={() => togglePermission(permission)} className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${active ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'}`}>
                  <span>{permission}</span>
                  <span className={`h-3 w-3 rounded-full ${active ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Save Changes</Button>
            <Button variant="secondary">Reset</Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminRolesPage;
