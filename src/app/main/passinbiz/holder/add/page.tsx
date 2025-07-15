'use client';
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderController from './page.controller';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { DynamicFields } from "@/components/common/forms/fields/DynamicKeyValueInput";
import { MAIN_ROUTE, PASSSINBIZ_MODULE_ROUTE } from '@/config/routes';
import { useRouter } from 'nextjs-toploader/app';

export interface HolderFormValues {
  "fullName": string;
  "email": string;
  "phoneNumber": string;
  "customFields"?: DynamicFields;
  isLinkedToUser: boolean
  type: "credential" | "event",
  entityId: string
  uid?: string
  parentId?: string
  passStatus?: string
  metadata?: any
};

export default function HolderList() {
  const { fields, initialValues, validationSchema, setDinamicDataAction } = useHolderController();
  const t = useTranslations();
  const { push } = useRouter()

  return (
    <Container maxWidth="xl">
      <PresentationCard
        title={t('holders.addHolder')}
        description={t('holders.description')}

      >
        <GenericForm<HolderFormValues>
          column={2}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={setDinamicDataAction}
          fields={fields as FormField[]}
          submitButtonText={t('core.button.save')}
          enableReinitialize
          onCancel={() => push(`/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/holder`)}

        />
      </PresentationCard>
    </Container>
  );
}
