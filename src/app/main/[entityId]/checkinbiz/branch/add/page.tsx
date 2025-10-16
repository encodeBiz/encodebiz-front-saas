'use client';
import { Box, Container } from '@mui/material';
import { useTranslations } from "next-intl";
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { CHECKINBIZ_MODULE_ROUTE } from '@/config/routes';
import { useLayout } from '@/hooks/useLayout';
import { useFormStatus } from '@/hooks/useFormStatus';
import { useRef } from 'react';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { ISucursal } from '@/domain/features/checkinbiz/ISucursal';
import * as Yup from 'yup';
import useFormController from '../form/form.controller';



export default function AddForm() {
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
                title={t('sucursal.add')}
                description={t('sucursal.formDesc')}
                isForm
                actions={
                    <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
                        <SassButton
                            disabled={formStatus?.isSubmitting}
                            onClick={() => navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/branch`)}
                            variant='outlined'

                        > {t('core.button.cancel')}</SassButton>
                        <SassButton
                            disabled={!formStatus?.isValid || formStatus?.isSubmitting}
                            onClick={handleExternalSubmit}
                            variant='contained'

                        > {t('core.button.saveChanges')}</SassButton>
                    </Box>
                }
            >

                <Box p={4} >
                    <GenericForm<Partial<ISucursal>>
                        column={2}
                        initialValues={initialValues}
                        validationSchema={Yup.object().shape({ ...validationSchema })}
                        onSubmit={(values) => handleSubmit(values)}
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
