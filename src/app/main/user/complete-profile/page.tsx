
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
 
const CompleteProfilePage = () => {
    const t = useTranslations();
    const { initialValues, validationSchema, setUserDataAction, fields, pending } = useUserProfileController();
    const { user } = useAuth()
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

//http://localhost:3000/main/kQtfzGZgcWZSLBgR7Oso/entity?authToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTc1NzAyOTA3NywiZXhwIjoxNzU3MDMyNjc3LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1mYnN2Y0BlbmNvZGViaXotc2VydmljZXMuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzdWIiOiJmaXJlYmFzZS1hZG1pbnNkay1mYnN2Y0BlbmNvZGViaXotc2VydmljZXMuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJ1aWQiOiI3cVVYajBwdVZiTTYyZmZ2SEtFaW83MzRPVWcxIn0.kD7aSwzTGQhpAUVcPJj9FUhVlNFXdn8wYMgis5Fp0j2oaCCkJficEfuipD6G4IuQ1tqhh3pRGjH09Qi91VDzRp1Ftw-CnJwQUDwLLxrwIRHzBMPGBGO-br8J8VC0H7CNBKjwpO1g0jbp65ze2-GclebYLdXliTnmnuvxP7juGeMOh4VA73KQsTTobKCwO97pAk9y__VvVyeuQX-e2RGO4poZLTODQOjvFTS2uX4pLqDcXDCyAdNKFlgsRJDXUJolTIQk6921TKcqDVGLbgTFJzusk0rr4VbrSAuoznP0wJq6XE5lmfKSP93vrWogYUPMFRxFR5npUE_4crgmzb1xxQ&guest=7qUXj0puVbM62ffvHKEio734OUg1_kQtfzGZgcWZSLBgR7Oso