import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password should be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (values: LoginFormValues) => {
    setFormError('');
    login(values.email, values.password);
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid md:grid-cols-2">
          <div className="hidden bg-indigo-950 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-3"><ShieldCheck size={26} /></div>
              <h1 className="text-3xl font-semibold">Secure legal evidence access</h1>
              <p className="mt-3 max-w-sm text-sm text-indigo-100">Review case files, evidence chains, and approvals in one protected workspace.</p>
            </div>
            <div className="text-sm text-indigo-100">Trusted by legal and investigative teams.</div>
          </div>
          <div className="p-8 sm:p-10">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Sign in</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-500">Access your digital evidence workspace.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
              <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" className="rounded border-slate-300" {...register('rememberMe')} />
                  Remember me
                </label>
                <a href="#" className="text-indigo-600">Forgot password?</a>
              </div>
              {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
              <Button type="submit" fullWidth disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Login'}</Button>
            </form>
            <p className="mt-6 text-sm text-slate-500">
              Need an account?{' '}
              <Link to="/register" className="font-medium text-indigo-600">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
