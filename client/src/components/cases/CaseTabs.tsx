import { useState, type ReactNode } from 'react';

interface CaseTabsProps {
  tabs: Array<{ id: string; label: string }>;
  children: Record<string, ReactNode>;
}

export const CaseTabs = ({ tabs, children }: CaseTabsProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? 'overview');

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-3 py-2 text-sm font-medium transition ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">{children[activeTab]}</div>
    </div>
  );
};
