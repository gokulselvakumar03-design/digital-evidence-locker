import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import type { Case } from '../../types';

const caseSchema = z.object({
  title: z.string().min(1, 'Case title is required'),
  type: z.string().min(1, 'Case type is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  client: z.string().optional(),
  assignedInvestigator: z.string().optional(),
  assignedLawyer: z.string().optional(),
  incidentDate: z.string().optional(),
  incidentLocation: z.string().optional(),
  status: z.enum(['OPEN', 'ACTIVE', 'PENDING_REVIEW', 'CLOSED']).optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

export type CaseFormValues = z.infer<typeof caseSchema>;

interface CaseFormProps {
  initialValues?: Partial<Case>;
  submitLabel: string;
  onSubmit: (values: CaseFormValues) => void;
  onCancel: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const CaseForm = ({ initialValues, submitLabel, onSubmit, onCancel, secondaryActionLabel, onSecondaryAction }: CaseFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      title: initialValues?.title ?? '',
      type: initialValues?.type ?? '',
      description: initialValues?.description ?? '',
      priority: initialValues?.priority ?? 'MEDIUM',
      client: initialValues?.client ?? '',
      assignedInvestigator: initialValues?.assignedInvestigator ?? '',
      assignedLawyer: initialValues?.assignedLawyer ?? '',
      incidentDate: initialValues?.incidentDate ?? '',
      incidentLocation: initialValues?.incidentLocation ?? '',
      status: initialValues?.status ?? 'OPEN',
      tags: initialValues?.tags?.join(', ') ?? '',
      notes: initialValues?.notes ?? '',
    },
  });

  useEffect(() => {
    reset({
      title: initialValues?.title ?? '',
      type: initialValues?.type ?? '',
      description: initialValues?.description ?? '',
      priority: initialValues?.priority ?? 'MEDIUM',
      client: initialValues?.client ?? '',
      assignedInvestigator: initialValues?.assignedInvestigator ?? '',
      assignedLawyer: initialValues?.assignedLawyer ?? '',
      incidentDate: initialValues?.incidentDate ?? '',
      incidentLocation: initialValues?.incidentLocation ?? '',
      status: initialValues?.status ?? 'OPEN',
      tags: initialValues?.tags?.join(', ') ?? '',
      notes: initialValues?.notes ?? '',
    });
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card title="Case Information" description="Core details for the legal matter.">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Case Title" placeholder="Enter a case title" error={errors.title?.message} {...register('title')} />
          <Input label="Case Type" placeholder="Financial Fraud" error={errors.type?.message} {...register('type')} />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-1.5 block">Description</span>
              <textarea
                rows={4}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                {...register('description')}
              />
              {errors.description ? <span className="mt-1.5 block text-xs text-red-500">{errors.description.message}</span> : null}
            </label>
          </div>
          <label className="text-sm font-medium text-slate-700">
            <span className="mb-1.5 block">Priority</span>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500"
              {...register('priority')}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
            {errors.priority ? <span className="mt-1.5 block text-xs text-red-500">{errors.priority.message}</span> : null}
          </label>
          {initialValues?.status ? (
            <label className="text-sm font-medium text-slate-700">
              <span className="mb-1.5 block">Status</span>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500"
                {...register('status')}
              >
                <option value="OPEN">Open</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="CLOSED">Closed</option>
              </select>
            </label>
          ) : null}
        </div>
      </Card>

      <Card title="People" description="Key personnel linked to the case.">
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Primary Client / Complainant" {...register('client')} />
          <Input label="Assigned Investigator" {...register('assignedInvestigator')} />
          <Input label="Assigned Lawyer" {...register('assignedLawyer')} />
        </div>
      </Card>

      <Card title="Incident Information" description="Timeline and location details.">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Incident Date" type="date" {...register('incidentDate')} />
          <Input label="Incident Location" {...register('incidentLocation')} />
        </div>
      </Card>

      <Card title="Additional Information" description="Case tags and notes.">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Tags" placeholder="Fraud, Compliance, Witness" {...register('tags')} />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-1.5 block">Notes</span>
              <textarea rows={4} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" {...register('notes')} />
            </label>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        {secondaryActionLabel && onSecondaryAction ? (
          <Button type="button" variant="secondary" onClick={onSecondaryAction}>{secondaryActionLabel}</Button>
        ) : null}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
};
