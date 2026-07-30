import { Activity, Briefcase, FolderKanban, ShieldCheck, Sparkles } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { DashboardCharts } from '../../components/dashboard/DashboardCharts';
import { mockActivities, mockCases, mockDashboardStats, mockEvidence } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';

const DashboardPage = () => {
  return (
    <AppLayout title="Dashboard">
      <PageHeader
        title="Operations overview"
        description="Secure case monitoring, review queues, and evidence status from a single workspace."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Cases" value={mockDashboardStats.totalCases} description="All active and archived matters" icon={<Briefcase size={18} />} />
        <StatCard title="Active Cases" value={mockDashboardStats.activeCases} description="Cases currently in motion" icon={<ShieldCheck size={18} />} />
        <StatCard title="Evidence Files" value={mockDashboardStats.evidenceFiles} description="Stored and reviewed items" icon={<FolderKanban size={18} />} />
        <StatCard title="Pending Reviews" value={mockDashboardStats.pendingReviews} description="Awaiting legal or investigative review" icon={<Sparkles size={18} />} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card title="Recent Cases" description="Latest matters requiring attention.">
          <div className="space-y-3">
            {mockCases.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.caseNumber}</p>
                </div>
                <Badge tone={item.status === 'ACTIVE' ? 'emerald' : 'amber'}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Evidence" description="Recently added evidence records.">
          <div className="space-y-3">
            {mockEvidence.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <Badge tone={item.status === 'VERIFIED' ? 'emerald' : 'amber'}>{item.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">{item.type} • {item.fileSize}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardCharts />
        <Card title="Recent Activity" description="Latest updates from the legal workflow platform.">
          <div className="space-y-3">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600"><Activity size={16} /></div>
                <div>
                  <p className="font-medium text-slate-900">{activity.title}</p>
                  <p className="text-sm text-slate-500">{activity.detail}</p>
                  <p className="mt-1 text-xs text-slate-400">{activity.actor} • {activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
