import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Briefcase, FolderKanban, LayoutDashboard, Menu, MessageSquareText, ShieldCheck, UserCircle2, X } from 'lucide-react';
import { Button } from '../ui/Button';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Cases', path: '/cases', icon: Briefcase },
  { label: 'Evidence Locker', path: '/evidence', icon: FolderKanban },
  { label: 'Timeline', path: '/timeline', icon: ShieldCheck },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Notifications', path: '/notifications', icon: MessageSquareText },
  { label: 'Profile', path: '/profile', icon: UserCircle2 },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) => {
  const location = useLocation();
  const content = (
    <aside className={`flex h-full flex-col border-r border-slate-200 bg-slate-50 ${collapsed ? 'w-20' : 'w-72'} transition-all duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-600 p-2 text-white">
            <ShieldCheck size={18} />
          </div>
          {!collapsed ? <div><p className="text-sm font-semibold text-slate-900">Evidence Locker</p><p className="text-xs text-slate-500">Legal Workflow</p></div> : null}
        </div>
        <Button variant="ghost" className="hidden md:inline-flex" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path} onClick={onMobileClose} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}>
              <Icon size={18} />
              {!collapsed ? <span>{label}</span> : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <>
      <div className="fixed inset-0 z-30 bg-slate-900/40 md:hidden" onClick={onMobileClose} style={{ display: mobileOpen ? 'block' : 'none' }} />
      <div className="fixed z-40 md:static md:block">{content}</div>
    </>
  );
};
