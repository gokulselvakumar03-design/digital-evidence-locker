import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { CaseForm, type CaseFormValues } from '../../components/cases/CaseForm';
import { PageHeader } from '../../components/ui/PageHeader';
import { mockCases } from '../../data/mockData';

const CaseFormPage = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(caseId);

  const initialValues = useMemo(() => mockCases.find((item) => item.id === caseId), [caseId]);

  const handleSubmit = (values: CaseFormValues) => {
    const tags = values.tags ? values.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [];
    const nextCase = {
      ...initialValues,
      id: initialValues?.id ?? `case-${Date.now()}`,
      caseNumber: initialValues?.caseNumber ?? `CASE-2026-${String(mockCases.length + 1).padStart(3, '0')}`,
      title: values.title,
      description: values.description,
      type: values.type,
      priority: values.priority,
      status: values.status ?? initialValues?.status ?? 'OPEN',
      client: values.client ?? initialValues?.client,
      assignedInvestigator: values.assignedInvestigator ?? initialValues?.assignedInvestigator,
      assignedLawyer: values.assignedLawyer ?? initialValues?.assignedLawyer,
      incidentDate: values.incidentDate ?? initialValues?.incidentDate,
      incidentLocation: values.incidentLocation ?? initialValues?.incidentLocation,
      tags,
      notes: values.notes ?? initialValues?.notes,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    if (isEdit) {
      console.info('Mock case updated', nextCase);
    } else {
      console.info('Mock case created', nextCase);
    }

    navigate('/cases', { state: { successMessage: isEdit ? 'Case updated successfully.' : 'Case created successfully.' } });
  };

  return (
    <AppLayout title={isEdit ? 'Edit Case' : 'New Case'}>
      <PageHeader
        title={isEdit ? 'Edit Case' : 'Create Case'}
        description={isEdit ? 'Update the details for the selected matter.' : 'Create a new legal matter with core details and supporting information.'}
      />
      <CaseForm
        initialValues={initialValues}
        submitLabel={isEdit ? 'Save Changes' : 'Create Case'}
        secondaryActionLabel={isEdit ? undefined : 'Save Draft'}
        onSecondaryAction={() => navigate('/cases', { state: { successMessage: 'Draft saved locally for later.' } })}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/cases')}
      />
    </AppLayout>
  );
};

export default CaseFormPage;
