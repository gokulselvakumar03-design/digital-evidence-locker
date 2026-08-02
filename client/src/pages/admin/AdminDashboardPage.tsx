import { Activity, BarChart3, Database, FileText, HardDrive, ShieldCheck, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AppLayout } from '../../components/layout/AppLayout';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { mockAdminAnalytics, mockAdminHealth, mockAdminSecurity, mockAdminStorage, mockAdminSummary } from '../../data/mockData';

const AdminDashboardPage = () => {
  return (
    <AppLayout title="Admin">
      <PageHeader
        title="Admin dashboard"
        description="Monitor users, access control, evidence health, and system performance from one governance console."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Users" value={mockAdminSummary.totalUsers} description="Registered platform identities" icon={<Users size={18} />} />
        <StatCard title="Investigators" value={mockAdminSummary.investigators} description="Case investigators" icon={<ShieldCheck size={18} />} />
        <StatCard title="Lawyers" value={mockAdminSummary.lawyers} description="Legal review staff" icon={<FileText size={18} />} />
        <StatCard title="Cases" value={mockAdminSummary.cases} description="Open and archived matters" icon={<BarChart3 size={18} />} />
        <StatCard title="Evidence" value={mockAdminSummary.evidence} description="Stored assets in vault" icon={<Database size={18} />} />
        <StatCard title="Storage Used" value={mockAdminSummary.storageUsed} description="Live storage allocation" icon={<HardDrive size={18} />} />
        <StatCard title="Pending Reviews" value={mockAdminSummary.pendingReviews} description="Awaiting legal or compliance review" icon={<Activity size={18} />} />
        <StatCard title="System Health" value={mockAdminSummary.systemHealth} description="Operational health score" icon={<ShieldCheck size={18} />} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="System health" description="Current operational status across core platform services.">
          <div className="grid gap-3 md:grid-cols-2">
            {mockAdminHealth.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.value}</p>
                </div>
                <Badge tone={item.status === 'good' ? 'emerald' : 'amber'}>{item.value}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Security dashboard" description="Current trust and access events requiring attention.">
          <div className="grid gap-3 md:grid-cols-2">
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
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Permission Changes</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{mockAdminSecurity.permissionChanges}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Storage dashboard" description="Data allocation by media category.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAdminStorage} barSize={34}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="type" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="used" radius={[8, 8, 0, 0]}>
                  {mockAdminStorage.map((entry) => (
                    <Cell key={entry.type} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Admin analytics" description="Demographic and operational trends across the platform.">
          <div className="space-y-4">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mockAdminAnalytics.usersByRole} dataKey="value" nameKey="name" innerRadius={35} outerRadius={70} paddingAngle={3}>
                    {mockAdminAnalytics.usersByRole.map((entry, index) => (
                      <Cell key={entry.name} fill={['#4f46e5', '#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockAdminAnalytics.evidenceGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminDashboardPage;
