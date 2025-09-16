'use client';
import { Box, Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderController from './page.controller';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { CHECKINBIZ_MODULE_ROUTE } from '@/config/routes';
import { useParams, useSearchParams } from 'next/navigation';
import { useLayout } from '@/hooks/useLayout';
import { useFormStatus } from '@/hooks/useFormStatus';
import { useRef } from 'react';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { ISucursal } from '@/domain/features/checkinbiz/ISucursal';
import { ArrowLeftOutlined, SaveOutlined } from '@mui/icons-material';



export default function SucursalForm() {
  const { fields, initialValues, validationSchema, handleSubmit } = useHolderController();
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
        title={id ? t('sucursal.edit') : t('sucursal.add')}
        description={t('sucursal.formDesc')}
        isForm
        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            <SassButton
              disabled={formStatus?.isSubmitting}
              onClick={() => navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/sucursal?params=${searchParams.get('params')}`)}
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
          <GenericForm<Partial<ISucursal>>
            column={2}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
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
