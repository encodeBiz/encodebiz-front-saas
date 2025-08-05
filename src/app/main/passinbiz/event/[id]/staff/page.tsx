'use client';
import { Container } from '@mui/material';
import { useTranslations } from "next-intl";
import useStaffController from './page.controller';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { MAIN_ROUTE, PASSSINBIZ_MODULE_ROUTE } from '@/config/routes';
import { useRouter } from 'nextjs-toploader/app';
import { useParams } from 'next/navigation';
import { IEvent } from '@/domain/features/passinbiz/IEvent';



export default function EventForm() {
  const { fields, initialValues, validationSchema, setDinamicDataAction } = useStaffController();
  const t = useTranslations();
  const { push } = useRouter()
  const { id } = useParams<{ id: string }>()
  
  return (
    <Container maxWidth="xl">
      <PresentationCard
        title={t('staff.title')}
        description={t('event.description')}

      >
       
        <GenericForm<Partial<IEvent>>
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
