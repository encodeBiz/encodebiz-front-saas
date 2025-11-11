
'use client'
import React, { useRef } from 'react';
import {
    Box,
    Container
} from '@mui/material';
import { EntityFormValues, useRegisterController } from './page.controller';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { useTranslations } from 'next-intl';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { useFormStatus } from '@/hooks/useFormStatus';


const FormEntityPage = () => {
    const { handleCreateEntity, initialValues, validationSchema, fields } = useRegisterController()
    const t = useTranslations()
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
                title={t('features.entity.create.card.title')}
                description={t('features.entity.create.card.subtitle')}

                isForm
                actions={
                    <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
                        <SassButton
                            disabled={!formStatus?.isValid || formStatus?.isSubmitting}
                            onClick={handleExternalSubmit}
                            variant='contained'
                          
                        > {t('core.button.save')}</SassButton>
                    </Box>
                }
            >
                <Box p={4}>
                    <GenericForm<EntityFormValues>
                        column={2}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleCreateEntity}
                        fields={fields as FormField[]}
                        activateWatchStatus
                        hideBtn
                        formRef={formRef}  
                        submitButtonText={t('core.button.save')}              
                    />
                </Box>
            </HeaderPage>


        </Container>
    );
};

export default FormEntityPage;
