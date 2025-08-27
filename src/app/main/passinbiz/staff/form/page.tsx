'use client';
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useStaffController from './page.controller';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { MAIN_ROUTE, PASSSINBIZ_MODULE_ROUTE } from '@/config/routes';
import { useRouter } from 'nextjs-toploader/app';
import { useParams } from 'next/navigation';
import { IStaff } from '@/domain/features/passinbiz/IStaff';
 
export default function StaffForm() {
  const { fields, initialValues, validationSchema, submitForm } = useStaffController();
  const t = useTranslations();
  const { push } = useRouter()
  const { id } = useParams<{ id: string }>()

  return (
    <Container maxWidth="xl">
      <HeaderPage
        title={id?t('staff.edit'):t('staff.add')}
        description={t('staff.description')}
      >
        <GenericForm<Partial<IStaff>>
          column={2}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitForm}
          fields={fields as FormField[]}
          submitButtonText={t('core.button.save')}
          enableReinitialize
          onCancel={() => push(`/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/staff`)}

        />
      </HeaderPage>
    </Container>
  );
}
