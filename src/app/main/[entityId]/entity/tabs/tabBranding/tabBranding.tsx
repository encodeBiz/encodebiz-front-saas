
'use client'
import React from 'react';
import { useTranslations } from 'next-intl';
import { BrandFormValues, useSettingEntityController } from './page.controller';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { Typography } from '@mui/material';

const BrandPreferencesPage = ({ formRef }: { formRef: any }) => {
    const t = useTranslations();
    const { changeBrandAction, pending, fields2, initialBrandValues, brandValidationSchema } = useSettingEntityController();
    const { user } = useAuth()
    const { currentEntity } = useEntity()
    return (
        <> <Typography variant="h4" component="h1" align="left" sx={{ textAlign: 'left' }} >
            {t('entity.tabs.tab2.titleAbout')}
        </Typography>
            <Typography variant="subtitle1" align="left" color="text.secondary" sx={{ mb: 4, textAlign: 'left' }}>
                {t('entity.tabs.tab2.descriptionAbout')}
            </Typography>
            <GenericForm<BrandFormValues>
                column={3}
                disabled={!user?.id || !currentEntity || pending}
                initialValues={initialBrandValues}
                validationSchema={brandValidationSchema}
                onSubmit={changeBrandAction}
                fields={fields2 as FormField[]}
                submitButtonText={t('core.button.save')}
                enableReinitialize
                formRef={formRef}
                hideBtn={true}
                activateWatchStatus
            />
        </>
    );
};

export default BrandPreferencesPage;
