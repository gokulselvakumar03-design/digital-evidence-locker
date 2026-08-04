import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
}

export const StatCard = ({ title, value, description, icon }: StatCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">{icon}</div>
      </div>
      <p className="mt-3 text-sm text-slate-500">{description}</p>
    </div>
  );
};
