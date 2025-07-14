
'use client'
import React from 'react';
import {
    Container,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { UserFormValues, useUserProfileController } from './page.controller';
import { useAuth } from '@/hooks/useAuth';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';

const CompleteProfilePage = () => {
    const t = useTranslations();
    const { initialValues, validationSchema, setUserDataAction, fields, pending } = useUserProfileController();
    const { user } = useAuth()

    return (
        <Container maxWidth="xl">
            <PresentationCard
                title={t('core.signup.complete_profile')}
                description={t('core.signup.complete_profile_desc')}
            >
                <GenericForm<UserFormValues>
                    column={1}
                    enableReinitialize
                    disabled={!user?.id || pending}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={setUserDataAction}
                    fields={fields as FormField[]}
                    submitButtonText={t('core.button.submit')}
                />
            </PresentationCard>
        </Container>
    );
};

export default CompleteProfilePage;
