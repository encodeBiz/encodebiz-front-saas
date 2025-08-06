'use client';
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderController, { EmployeeFormValues } from './page.controller';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { MAIN_ROUTE, PASSSINBIZ_MODULE_ROUTE } from '@/config/routes';
import { useRouter } from 'nextjs-toploader/app';
import { useParams } from 'next/navigation';



export default function EmployeeForm() {
  const { fields, initialValues, validationSchema, handleSubmit } = useHolderController();
  const t = useTranslations();
  const { push } = useRouter()
    const { id } = useParams<{ id: string }>()
  
  return (
    <Container maxWidth="xl">
      <PresentationCard
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
          onCancel={() => push(`/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/event`)}
        />
      </PresentationCard>
    </Container>
  );
}
