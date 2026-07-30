interface BadgeProps {
  children: React.ReactNode;
  tone?: 'indigo' | 'slate' | 'emerald' | 'amber' | 'rose';
}

export const Badge = ({ children, tone = 'indigo' }: BadgeProps) => {
  const tones = {
    indigo: 'bg-indigo-50 text-indigo-700',
    slate: 'bg-slate-100 text-slate-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
  };

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
};
