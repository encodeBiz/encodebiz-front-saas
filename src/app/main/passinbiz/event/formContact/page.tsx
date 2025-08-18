'use client';
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderController from './page.controller';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { IContact } from '@/domain/core/IContact';



export default function FormContact() {
  const { fields, initialValues, validationSchema, setDinamicDataAction } = useHolderController();
  const t = useTranslations();
  
  return (
    <Container maxWidth="xl">
      <PresentationCard
        title={t('event.fremiunContact.title')}
        description={t('event.fremiunContact.description')}

      >

        <GenericForm<Partial<IContact>>
          column={2}
          initialValues={initialValues}
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
