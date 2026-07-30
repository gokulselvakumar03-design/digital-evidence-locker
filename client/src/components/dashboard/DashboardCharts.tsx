import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../ui/Card';

const caseStatusData = [
  { name: 'Active', value: 9, color: '#4f46e5' },
  { name: 'Pending Review', value: 6, color: '#64748b' },
  { name: 'Closed', value: 5, color: '#14b8a6' },
  { name: 'Open', value: 4, color: '#f59e0b' },
];

const evidenceTypeData = [
  { name: 'Documents', value: 42 },
  { name: 'Images', value: 31 },
  { name: 'Video', value: 18 },
  { name: 'Audio', value: 11 },
];

export const DashboardCharts = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Case Status Distribution" description="Snapshot of active and closed investigations.">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={caseStatusData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                {caseStatusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Evidence Type Distribution" description="Current filing mix by evidence type.">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={evidenceTypeData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                {evidenceTypeData.map((entry, index) => (
                  <Cell key={entry.name} fill={['#4f46e5', '#64748b', '#14b8a6', '#f59e0b'][index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
