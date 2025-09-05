'use client';
import { Box, Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderController from './page.controller';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { ContactFromModel } from '@/domain/core/IContact';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useRef } from 'react';
import { useFormStatus } from '@/hooks/useFormStatus';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { SaveOutlined } from '@mui/icons-material';



export default function FormContact() {
  const { fields, validationSchema, setDinamicDataAction } = useHolderController();
  const t = useTranslations();
  const { user } = useAuth()
  const { currentEntity } = useEntity()
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
        title={t('event.fremiunContact.title')}
        description={t('event.fremiunContact.description')}
        isForm
        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>

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

          <GenericForm<Partial<ContactFromModel>>
            column={2}
            initialValues={{
              "subject": t('contact.test1'),
              "message": '',
              "email": user?.email as string,
              "phone": user?.phoneNumber as string,
              "name": currentEntity?.entity.name as string,
            }}
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
    </Container>
  );
}
