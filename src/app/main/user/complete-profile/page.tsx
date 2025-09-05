
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

 

//http://localhost:3000//main/kQtfzGZgcWZSLBgR7Oso/entity?authToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTc1NzA0MDIyNiwiZXhwIjoxNzU3MDQzODI2LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1mYnN2Y0BlbmNvZGViaXotc2VydmljZXMuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzdWIiOiJmaXJlYmFzZS1hZG1pbnNkay1mYnN2Y0BlbmNvZGViaXotc2VydmljZXMuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJ1aWQiOiJjb3hlU0c0dUFIZDJmRFZFbEMzM3VRNUxMUDQzIn0.iAcL57kbZX7VpMqYBMn3fHzJGa2QA1fVRCgBu9XRmmzcz-WK5g9hu-VCTKXEWX__zDCdyDzEcN3j0DiXWYDdlf_fXMfT44xVmQr6sdN58BylTqHRxjZNgi2wX5FqMRLeGK-yfqbw3vmMXP99jeCuxD05ycSww1lFuqosfGGjTzETaV2K_ssw9noLygnhi8RZqd-y-E0wdTEbkDh_v3FLAjdO-JPL8Rl5DkMUS1Uu1YCsHTYJx2IOsE2qVvUcR9dm3khd-BH57AmWAVoky_cnncTihWSPiHx9Lh25Qsof5BcvN93HVlkyC0ZXMtW4AlnVnWl1SBvO8VekdiZWsSWX1Q&guest=coxeSG4uAHd2fDVElC33uQ5LLP43_kQtfzGZgcWZSLBgR7Oso