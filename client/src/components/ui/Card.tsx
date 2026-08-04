import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const Card = ({ title, description, children, className = '' }: CardProps) => {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {title ? <div className="mb-4">{typeof title === 'string' ? <h3 className="text-lg font-semibold text-slate-900">{title}</h3> : title}</div> : null}
      {description ? <p className="mb-4 text-sm text-slate-500">{description}</p> : null}
      {children}
    </section>
  );
};
