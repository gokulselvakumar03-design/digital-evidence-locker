import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password should be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
    role: z.enum(['VICTIM', 'LAWYER', 'INVESTIGATOR', 'POLICE_OFFICER', 'JUDGE']),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid md:grid-cols-2">
          <div className="hidden bg-indigo-950 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-3"><ShieldCheck size={26} /></div>
              <h1 className="text-3xl font-semibold">Create a secure account</h1>
              <p className="mt-3 max-w-sm text-sm text-indigo-100">Join the legal workflow platform as a victim, counsel, investigator, officer, or judge.</p>
            </div>
          </div>
          <div className="p-8 sm:p-10">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Register</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Create your account</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Full Name" error={errors.fullName?.message} {...register('fullName')} />
              <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
              <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
              <Input label="Confirm Password" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-1.5 block">Role</span>
                <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" {...register('role')}>
                  <option value="VICTIM">Victim</option>
                  <option value="LAWYER">Lawyer</option>
                  <option value="INVESTIGATOR">Investigator</option>
                  <option value="POLICE_OFFICER">Police Officer</option>
                  <option value="JUDGE">Judge</option>
                </select>
              </label>
              <Button type="submit" fullWidth disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create Account'}</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
