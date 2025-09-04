
'use client'
import React, { useRef } from 'react';
import {
    Box,
    Container,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { UserFormValues, useUserProfileController } from './page.controller';
import { useAuth } from '@/hooks/useAuth';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { useFormStatus } from '@/hooks/useFormStatus';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { SaveOutlined } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';

const CompleteProfilePage = () => {
    const t = useTranslations();
    const { initialValues, validationSchema, setUserDataAction, fields, pending } = useUserProfileController();
    const { user } = useAuth()
    const formRef = useRef(null)
    const { formStatus } = useFormStatus()
    const searchParams = useSearchParams()

    const handleExternalSubmit = () => {
        if (formRef.current) {
            (formRef.current as any).submitForm()
        }
    }
    return (
        <Container maxWidth="xl">
            <HeaderPage
                title={t('core.signup.complete_profile')}
                description={t('core.signup.complete_profile_desc')}
                isForm
                actions={
                    <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
                        <SassButton
                            disabled={!formStatus?.isValid || formStatus?.isSubmitting}
                            onClick={handleExternalSubmit}
                            variant='contained'
                            startIcon={<SaveOutlined />}
                        > {t('core.button.saveChanges')}</SassButton>
                    </Box>
                }
            >
                <Box p={4}>
                    <GenericForm<UserFormValues>
                        column={1}
                        enableReinitialize
                        disabled={!user?.id || pending}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={setUserDataAction}
                        fields={fields as FormField[]}
                        activateWatchStatus
                        hideBtn
                        formRef={formRef}
                    />
                </Box>
            </HeaderPage>

        </Container>
    );
};

export default CompleteProfilePage;
