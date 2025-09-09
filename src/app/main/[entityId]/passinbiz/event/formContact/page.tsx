'use client';
import { Box, Container } from '@mui/material';
import { useTranslations } from "next-intl";
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { ContactFromModel } from '@/domain/core/IContact';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { useFormStatus } from '@/hooks/useFormStatus';
import { SassButton } from '@/components/common/buttons/GenericButton';
import InfoModal from '@/components/common/modals/InfoModal';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import useFormContactController from './page.controller';



export default function FormContact() {
  const { fields, validationSchema, setDinamicDataAction, formRef } = useFormContactController();
  const t = useTranslations();
  const { user } = useAuth()
  const { currentEntity } = useEntity()
 
  const { formStatus } = useFormStatus()
  const { open } = useCommonModal()

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
            > {t('core.label.send')}</SassButton>
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

      {open.type === CommonModalType.INFO && <InfoModal
        title={t('event.info.title')}
        description={t('event.info.description')}
        cancelBtn
      />}
    </Container>
  );
}
