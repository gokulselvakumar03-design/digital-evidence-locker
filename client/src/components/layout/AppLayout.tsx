import { useState, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  title: string;
  children: ReactNode;
}

export const AppLayout = ({ title, children }: AppLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <div className="flex-1">
          <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 md:hidden">
            <Button variant="ghost" className="p-2" onClick={() => setMobileOpen(true)}>
              <Menu size={18} />
            </Button>
            <div>
              <p className="text-sm font-medium text-slate-500">Secure Legal Operations</p>
              <p className="text-sm font-semibold text-slate-900">{title}</p>
            </div>
          </div>
          <Navbar title={title} />
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};
