
'use client'
import React from 'react';
import {
    Container,
    Box,
    Typography,
    Divider,
    Paper
} from '@mui/material';
import { EntityFormValues, useRegisterController } from './page.controller';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { useTranslations } from 'next-intl';
import { useStyles } from './page.styles';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
 

const FormEntityPage = () => {
    const { handleCreateEntity, initialValues, validationSchema, fields } = useRegisterController()
    const t = useTranslations()
    const classes = useStyles();

    return (
        <Container maxWidth="xl">
            <PresentationCard
                title={t('features.entity.create.card.title')}
                description={t('features.entity.create.card.subtitle')}
            >
                <GenericForm<EntityFormValues>
                    
                    column={2}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleCreateEntity}
                    fields={fields as FormField[]}
                    submitButtonText={t('core.button.submit')}

                />
            </PresentationCard>


        </Container>
    );
};

export default FormEntityPage;
