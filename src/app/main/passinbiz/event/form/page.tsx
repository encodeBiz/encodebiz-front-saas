'use client';
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderController, { EventFromValues } from './page.controller';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { MAIN_ROUTE, PASSSINBIZ_MODULE_ROUTE } from '@/config/routes';
import { useRouter } from 'nextjs-toploader/app';
import { useParams } from 'next/navigation';



export default function EventForm() {
  const { fields, initialValues, validationSchema, setDinamicDataAction } = useHolderController();
  const t = useTranslations();
  const { push } = useRouter()
  const { id } = useParams<{ id: string }>()
  
  return (
    <Container maxWidth="xl">
      <PresentationCard
        title={id?t('event.edit'):t('event.add')}
        description={t('event.description')}

      >
       
        <GenericForm<EventFromValues>
          column={2}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={setDinamicDataAction}
          fields={fields as FormField[]}
          submitButtonText={t('core.button.save')}
          enableReinitialize
          onCancel={() => push(`/${MAIN_ROUTE}/${PASSSINBIZ_MODULE_ROUTE}/event`)}
        />
      </PresentationCard>
    </Container>
  );
}
