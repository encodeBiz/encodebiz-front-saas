'use client';
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderController from './page.controller';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { MAIN_ROUTE, PASSSINBIZ_MODULE_ROUTE } from '@/config/routes';
import { useRouter } from 'nextjs-toploader/app';
import { useParams } from 'next/navigation';
import { Holder } from '@/domain/features/passinbiz/IHolder';
 

export default function HolderForm() {
  const { fields, initialValues, validationSchema, submitForm } = useHolderController();
  const t = useTranslations();
  const { push } = useRouter()
  const { id } = useParams<{ id: string }>()

  return (
    <Container maxWidth="xl">
      <PresentationCard
        title={id?t('holders.editHolder'):t('holders.addHolder')}
        description={t('holders.description')}
      >
        {JSON.stringify(fields.map(e=>e.name))}
        <GenericForm<Partial<Holder>>
          column={2}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitForm}
          fields={fields as FormField[]}
          submitButtonText={t('core.button.save')}
          enableReinitialize
          onCancel={() => push(`/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/holder`)}

        />
      </PresentationCard>
    </Container>
  );
}
