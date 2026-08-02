import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { mockAdminPlatformSettings, mockAdminSecurity, mockPermissionMatrix } from '../../data/mockData';

const AdminSettingsPage = () => {
  return (
    <AppLayout title="Admin Settings">
      <PageHeader title="Platform settings" description="Configuration for governance, retention, automation, and platform defaults." />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card title="Platform configuration" description="Core operational settings for the evidence platform.">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">Application Name</span>
              <input defaultValue={mockAdminPlatformSettings.applicationName} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            </label>
            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">Evidence Retention</span>
              <input defaultValue={mockAdminPlatformSettings.evidenceRetention} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            </label>
            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">Backup Frequency</span>
              <input defaultValue={mockAdminPlatformSettings.backupFrequency} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            </label>
            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">Notification Defaults</span>
              <input defaultValue={mockAdminPlatformSettings.notificationDefaults} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            </label>
          </div>

          <div className="mt-5 space-y-4">
            {[
              ['Auto Archive', mockAdminPlatformSettings.autoArchive],
              ['AI Analysis Enabled', mockAdminPlatformSettings.aiAnalysisEnabled],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-medium text-slate-800">{String(label)}</p>
                <button type="button" className={`relative h-7 w-12 rounded-full transition ${Boolean(value) ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${Boolean(value) ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button>Save Settings</Button>
            <Button variant="secondary">Reset</Button>
          </div>
        </Card>

        <Card title="Security overview" description="Current security and access monitoring indicators.">
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Failed Logins</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{mockAdminSecurity.failedLogins}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Integrity Failures</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{mockAdminSecurity.integrityFailures}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Recent Security Events</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{mockAdminSecurity.recentSecurityEvents}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Active Sessions</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{mockAdminSecurity.activeSessions}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Permission matrix" description="Role-based permissions by operational area." className="mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-3 py-3 font-medium">Area</th>
                <th className="px-3 py-3 font-medium">Admin</th>
                <th className="px-3 py-3 font-medium">Lawyer</th>
                <th className="px-3 py-3 font-medium">Investigator</th>
                <th className="px-3 py-3 font-medium">Officer</th>
                <th className="px-3 py-3 font-medium">Citizen</th>
              </tr>
            </thead>
            <tbody>
              {mockPermissionMatrix.map((row) => (
                <tr key={row.area} className="border-b border-slate-100">
                  <td className="px-3 py-3 font-medium text-slate-900">{row.area}</td>
                  <td className="px-3 py-3 text-slate-700">{row.admin}</td>
                  <td className="px-3 py-3 text-slate-700">{row.lawyer}</td>
                  <td className="px-3 py-3 text-slate-700">{row.investigator}</td>
                  <td className="px-3 py-3 text-slate-700">{row.officer}</td>
                  <td className="px-3 py-3 text-slate-700">{row.citizen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  );
};

export default AdminSettingsPage;
