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
    const generatedCaseNumber = initialValues?.caseNumber ?? `CASE-2026-${String(mockCases.length + 1).padStart(3, '0')}`;

    void {
      tags,
      generatedCaseNumber,
      initialValues,
      values,
    };

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
