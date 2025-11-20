'use client';
import { Box, Container } from '@mui/material';
import { useTranslations } from "next-intl";
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { PASSSINBIZ_MODULE_ROUTE } from '@/config/routes';
import { IEvent } from '@/domain/features/passinbiz/IEvent';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { useRef } from 'react';
import { useFormStatus } from '@/hooks/useFormStatus';
import { useLayout } from '@/hooks/useLayout';
import useFormController from '../form/form.controller';
export default function EventForm() {
    const { fields, initialValues, validationSchema, handleSubmit } = useFormController(false);
    const t = useTranslations();
    const { navivateTo } = useLayout()
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
                title={t('event.add')}
                description={t('event.formDesc')}
                isForm
                actions={
                    <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
                        <SassButton
                            disabled={formStatus?.isSubmitting}
                            onClick={() => navivateTo(`/${PASSSINBIZ_MODULE_ROUTE}/event`)}
                            variant='outlined'

                        > {t('core.button.cancel')}</SassButton>
                        <SassButton
                            disabled={!formStatus?.isValid || formStatus?.isSubmitting}
                            onClick={handleExternalSubmit}
                            variant='contained'

                        > {t('core.button.save')}</SassButton>
                    </Box>
                }
            >
                <Box p={4}>
                    <GenericForm<Partial<IEvent>>
                        column={2}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values)=>handleSubmit(values)}
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
