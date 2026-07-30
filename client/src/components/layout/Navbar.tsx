import { Bell, ChevronDown, Search, UserCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface NavbarProps {
  title: string;
}

export const Navbar = ({ title }: NavbarProps) => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 md:px-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Secure Legal Operations</p>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <label className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:flex">
          <Search size={16} />
          <input className="w-36 bg-transparent outline-none" placeholder="Search" />
        </label>
        <Button variant="ghost" className="rounded-full p-2">
          <Bell size={18} />
        </Button>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
          <UserCircle2 size={18} className="text-indigo-600" />
          <div className="hidden text-left md:block">
            <p className="text-sm font-medium text-slate-900">{user?.firstName ?? 'User'}</p>
            <p className="text-xs text-slate-500">{user?.role ?? 'Member'}</p>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
};
