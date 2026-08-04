import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label ? <span className="mb-1.5 block">{label}</span> : null}
      <input
        ref={ref}
        className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error ? <span className="mt-1.5 block text-xs text-red-500">{error}</span> : null}
    </label>
  );
});

Input.displayName = 'Input';
