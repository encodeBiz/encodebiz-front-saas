'use client';
import { Box, Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderController from './page.controller';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { MAIN_ROUTE, PASSSINBIZ_MODULE_ROUTE } from '@/config/routes';
import { useRouter } from 'nextjs-toploader/app';
import { useParams } from 'next/navigation';
import { IEvent } from '@/domain/features/passinbiz/IEvent';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { ArrowLeftOutlined, SaveOutlined } from '@mui/icons-material';
import { useRef } from 'react';
import { useFormStatus } from '@/hooks/useFormStatus';



export default function EventForm() {
  const { fields, initialValues, validationSchema, setDinamicDataAction } = useHolderController();
  const t = useTranslations();
  const { push } = useRouter()
  const { id } = useParams<{ id: string }>()
  const formRef = useRef(null)
  const { formStatus } = useFormStatus()

  const handleExternalSubmit = () => {
    if (formRef.current) {
      (formRef.current as any).submitForm()
    }
  }

  return (
    <Container maxWidth="xl">
      <HeaderPage
        title={id ? t('event.edit') : t('event.add')}
        description={t('event.formDesc')}
        isForm
        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            <SassButton
              disabled={formStatus?.isSubmitting}
              onClick={() => push(`/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/event`)}
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
          <GenericForm<Partial<IEvent>>
            column={2}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={setDinamicDataAction}
            fields={fields as FormField[]}
            enableReinitialize
            activateWatchStatus
            hideBtn
            formRef={formRef}
          />
        </Box>
      </HeaderPage>
    </Container >
  );
}
