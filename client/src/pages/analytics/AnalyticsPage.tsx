import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, BarChart3, Briefcase, Download, FileText, FolderKanban, ShieldCheck, Sparkles } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { analyticsService } from '../../services/analytics.service';

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('30 Days');
  const [caseType, setCaseType] = useState('All Types');
  const [priority, setPriority] = useState('All Priorities');
  const [status, setStatus] = useState('All Statuses');
  const summary = analyticsService.getSummary();
  const caseStatusData = analyticsService.getCaseStatusData();
  const casePriorityData = analyticsService.getCasePriorityData();
  const evidenceTypeData = analyticsService.getEvidenceTypeData();
  const monthlyCaseActivity = analyticsService.getMonthlyCaseActivity();
  const monthlyEvidenceUploads = analyticsService.getMonthlyEvidenceUploads();
  const verificationRate = analyticsService.getVerificationRate();
  const investigatorPerformance = analyticsService.getInvestigatorPerformance();
  const lawyerActivity = analyticsService.getLawyerActivity();
  const evidenceAnalytics = analyticsService.getEvidenceAnalytics();
  const timelineAnalytics = analyticsService.getTimelineAnalytics();
  const riskAnalytics = analyticsService.getRiskAnalytics();
  const caseTypes = analyticsService.getCaseTypes();
  const priorities = analyticsService.getPriorities();
  const statuses = analyticsService.getStatuses();

  const riskBreakdown = useMemo(
    () => [
      { label: 'Low', value: riskAnalytics.low, color: '#22c55e' },
      { label: 'Medium', value: riskAnalytics.medium, color: '#f59e0b' },
      { label: 'High', value: riskAnalytics.high, color: '#ef4444' },
    ],
    [riskAnalytics]
  );

  return (
    <AppLayout title="Analytics">
      <PageHeader
        title="Executive analytics"
        description="Operational performance, case health, evidence quality, and risk indicators across the legal workflow platform."
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="px-3 py-2">
              <span className="flex items-center gap-2"><Download size={16} /> Export PDF</span>
            </Button>
            <Button variant="secondary" className="px-3 py-2">
              <span className="flex items-center gap-2"><Download size={16} /> Export CSV</span>
            </Button>
          </div>
        }
      />

      <Card className="mb-6">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="block text-sm text-slate-600">
            <span className="mb-1.5 block font-medium text-slate-700">Date Range</span>
            <select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              <option>Last 7 Days</option>
              <option>30 Days</option>
              <option>90 Days</option>
              <option>Year</option>
            </select>
          </label>

          <label className="block text-sm text-slate-600">
            <span className="mb-1.5 block font-medium text-slate-700">Case Type</span>
            <select value={caseType} onChange={(event) => setCaseType(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              {caseTypes.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-slate-600">
            <span className="mb-1.5 block font-medium text-slate-700">Priority</span>
            <select value={priority} onChange={(event) => setPriority(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              {priorities.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-slate-600">
            <span className="mb-1.5 block font-medium text-slate-700">Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              {statuses.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total Cases" value={summary.totalCases} description="All active and archived matters" icon={<Briefcase size={18} />} />
        <StatCard title="Active Cases" value={summary.activeCases} description="Currently active investigations" icon={<ShieldCheck size={18} />} />
        <StatCard title="Closed Cases" value={summary.closedCases} description="Completed and archived matters" icon={<Sparkles size={18} />} />
        <StatCard title="Evidence Files" value={summary.evidenceFiles} description="Stored and reviewed items" icon={<FolderKanban size={18} />} />
        <StatCard title="Verified Evidence" value={summary.verifiedEvidence} description="Integrity-verified items" icon={<FileText size={18} />} />
        <StatCard title="Pending Reviews" value={summary.pendingReviews} description="Awaiting legal review" icon={<BarChart3 size={18} />} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Cases by Status" description="Snapshot of current matter distribution.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={caseStatusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {caseStatusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Cases by Priority" description="Operational intensity across the portfolio.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={casePriorityData} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Evidence Types" description="Current evidence mix by collection category.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={evidenceTypeData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={90} paddingAngle={3}>
                  {evidenceTypeData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Monthly Case Activity" description="Case progression over the past eight months.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyCaseActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="cases" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Monthly Evidence Uploads" description="Evidence intake trend and preservation volume.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEvidenceUploads}>
                <defs>
                  <linearGradient id="uploadFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="uploads" stroke="#14b8a6" fill="url(#uploadFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Evidence Verification Rate" description="Verified material against pending review backlog.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="40%" outerRadius="95%" data={verificationRate} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={10} />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center">
            <p className="text-3xl font-semibold text-slate-900">78%</p>
            <p className="text-sm text-slate-500">Integrity verification rate</p>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Investigator Performance" description="Review load and resolution quality across the current team.">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3 font-medium">Investigator</th>
                  <th className="px-3 py-3 font-medium">Assigned Cases</th>
                  <th className="px-3 py-3 font-medium">Closed Cases</th>
                  <th className="px-3 py-3 font-medium">Evidence Reviewed</th>
                  <th className="px-3 py-3 font-medium">Avg Resolution</th>
                </tr>
              </thead>
              <tbody>
                {investigatorPerformance.map((person) => (
                  <tr key={person.investigator} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-3 font-medium text-slate-900">{person.investigator}</td>
                    <td className="px-3 py-3">{person.assignedCases}</td>
                    <td className="px-3 py-3">{person.closedCases}</td>
                    <td className="px-3 py-3">{person.evidenceReviewed}</td>
                    <td className="px-3 py-3">{person.avgResolutionTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Lawyer Activity" description="Attorney workload and filing activity.">
          <div className="space-y-4">
            {lawyerActivity.map((lawyer) => (
              <div key={lawyer.lawyer} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{lawyer.lawyer}</p>
                  <Badge tone="indigo">{lawyer.casesHandled} cases</Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
                  <div className="rounded-lg bg-white p-2">
                    <p className="font-semibold text-slate-900">{lawyer.courtSubmissions}</p>
                    <p>Submissions</p>
                  </div>
                  <div className="rounded-lg bg-white p-2">
                    <p className="font-semibold text-slate-900">{lawyer.pendingReviews}</p>
                    <p>Pending</p>
                  </div>
                  <div className="rounded-lg bg-white p-2">
                    <p className="font-semibold text-slate-900">{lawyer.casesHandled}</p>
                    <p>Handled</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card title="Evidence Analytics" description="Top evidence categories by share of total collection.">
          <div className="space-y-4">
            {evidenceAnalytics.map((item) => (
              <div key={item.type}>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-700">
                  <span>{item.type}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-indigo-600" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Timeline Analytics" description="Platform activity and evidence throughput over the selected period.">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: 'Events Today', value: timelineAnalytics.eventsToday, icon: <Activity size={16} /> },
              { label: 'Events This Week', value: timelineAnalytics.eventsThisWeek, icon: <BarChart3 size={16} /> },
              { label: 'Evidence Uploaded', value: timelineAnalytics.evidenceUploaded, icon: <FolderKanban size={16} /> },
              { label: 'Integrity Verifications', value: timelineAnalytics.integrityVerifications, icon: <ShieldCheck size={16} /> },
            ].map((metric) => (
              <div key={metric.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">{metric.icon}<span className="text-sm">{metric.label}</span></div>
                <p className="text-2xl font-semibold text-slate-900">{metric.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card title="Risk Analytics" description="Exposure by severity band and current risk posture.">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Risk Score</p>
                <p className="mt-1 text-3xl font-semibold text-slate-900">{riskAnalytics.score}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-2 text-amber-600"><AlertTriangle size={20} /></div>
            </div>
            <div className="space-y-3">
              {riskBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm text-slate-700">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full" style={{ width: `${(item.value / Math.max(...riskBreakdown.map((entry) => entry.value), 1)) * 100}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Operational Notes" description="Executive summary from the current reporting window.">
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Review queue health</p>
              <p className="mt-1 text-sm text-slate-600">Pending reviews are trending down relative to the previous reporting window, while verification completion remains above target.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Evidence integrity</p>
              <p className="mt-1 text-sm text-slate-600">The majority of file inventory is verified, with the highest risk concentration in video and digital access evidence categories.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Recommended action</p>
              <p className="mt-1 text-sm text-slate-600">Prioritize high-risk matters and continue scheduled review of pending evidence bundles flagged for legal response.</p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;
