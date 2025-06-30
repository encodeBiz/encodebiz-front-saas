'use client';
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderController from './page.controller';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { DynamicFields } from "@/components/common/forms/fields/DynamicKeyValueInput";

export interface HolderFormValues {
  "fullName": string;
  "email": string;
  "phoneNumber": string;
  "customFields": DynamicFields;
};

export default function HolderList() {
  const { fields, initialValues, validationSchema, setDinamicDataAction } = useHolderController();
  const t = useTranslations();

  return (
    <Container maxWidth="lg">
      <PresentationCard
        title={t('holders.addHolder')}
      >
        <GenericForm<HolderFormValues>
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
