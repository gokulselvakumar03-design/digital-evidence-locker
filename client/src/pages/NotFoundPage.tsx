import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <AppLayout title="Page Not Found">
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">404</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">The requested page could not be found.</h2>
        <p className="mt-2 text-sm text-slate-500">The route you entered may be outdated or unavailable.</p>
        <Link to="/dashboard">
          <Button className="mt-6">Return to dashboard</Button>
        </Link>
      </div>
    </AppLayout>
  );
};

export default NotFoundPage;
