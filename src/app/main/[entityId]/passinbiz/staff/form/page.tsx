'use client';
import { Box, Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useStaffController from './page.controller';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { PASSSINBIZ_MODULE_ROUTE } from '@/config/routes';
import { useParams, useSearchParams } from 'next/navigation';
import { IStaff } from '@/domain/features/passinbiz/IStaff';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { ArrowLeftOutlined, SaveOutlined } from '@mui/icons-material';
import { useRef } from 'react';
import { useFormStatus } from '@/hooks/useFormStatus';
import { useLayout } from '@/hooks/useLayout';

export default function StaffForm() {
  const { fields, initialValues, validationSchema, submitForm } = useStaffController();
  const t = useTranslations();
  const { navivateTo } = useLayout()
  const { id } = useParams<{ id: string }>()
  const formRef = useRef(null)
  const { formStatus } = useFormStatus()
  const searchParams = useSearchParams()

  const handleExternalSubmit = () => {
    if (formRef.current) {
      (formRef.current as any).submitForm()
    }
  }
  return (
    <Container maxWidth="xl">
      <HeaderPage
        title={id ? t('staff.edit') : t('staff.add')}
        description={t('staff.formDesc')}
        isForm
        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            <SassButton
              disabled={formStatus?.isSubmitting}
              onClick={() => navivateTo(`/${PASSSINBIZ_MODULE_ROUTE}/staff?params=${searchParams.get('params')}`)}
              variant='outlined'
              startIcon={<ArrowLeftOutlined />}
            > {t('core.button.cancel')}</SassButton>
            <SassButton
              disabled={!formStatus?.isValid || formStatus?.isSubmitting}
              onClick={handleExternalSubmit}
              variant='contained'
              startIcon={<SaveOutlined />}
            > {t('core.button.saveChanges')}</SassButton>
          </Box>
        }
      >
        <Box p={4}>
          <GenericForm<Partial<IStaff>>
            column={2}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitForm}
            fields={fields as FormField[]}
            enableReinitialize
            activateWatchStatus
            hideBtn
            formRef={formRef}
          />
        </Box>
      </HeaderPage>
    </Container>
  );
}
