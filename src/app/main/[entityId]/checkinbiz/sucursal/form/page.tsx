'use client';
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderController, { EmployeeFormValues } from './page.controller';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { CHECKINBIZ_MODULE_ROUTE } from '@/config/routes';
import { useParams } from 'next/navigation';
import { useLayout } from '@/hooks/useLayout';



export default function EmployeeForm() {
  const { fields, initialValues, validationSchema, handleSubmit } = useHolderController();
  const t = useTranslations();
  const { navivateTo } = useLayout()
    const { id } = useParams<{ id: string }>()
  
  return (
    <Container maxWidth="xl">
      <HeaderPage
        title={id?t('employee.update'):t('employee.add')}
        description={t('event.description')}
      >       
        <GenericForm<EmployeeFormValues>
          column={2}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={fields as FormField[]}
          submitButtonText={t('core.button.save')}
          enableReinitialize
          onCancel={() => navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee`)}
        />
      </HeaderPage>
    </Container>
  );
}
