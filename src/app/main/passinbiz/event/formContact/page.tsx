'use client';
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderController from './page.controller';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { IContact } from '@/domain/core/IContact';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';



export default function FormContact() {
  const { fields, validationSchema, setDinamicDataAction } = useHolderController();
  const t = useTranslations();
  const {user} = useAuth()
  const {currentEntity} = useEntity() 
  return (
    <Container maxWidth="xl">
      <PresentationCard
        title={t('event.fremiunContact.title')}
        description={t('event.fremiunContact.description')}

      >

        <GenericForm<Partial<IContact>>
          column={2}
          initialValues={{
            "subject": 'Solicito realizar una prueba de evento',
            "message": '',
            "from": user?.email as string,
            "phone": user?.phoneNumber as string,
            "displayName": currentEntity?.entity.name as string,
          }}
          validationSchema={validationSchema}
          onSubmit={setDinamicDataAction}
          fields={fields as FormField[]}
          submitButtonText={t('core.button.save')}
          enableReinitialize
        />
      </PresentationCard>
    </Container>
  );
}
