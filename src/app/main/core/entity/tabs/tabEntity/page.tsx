
'use client'
import React from 'react';
import {
    Typography,

} from '@mui/material';
import { useTranslations } from 'next-intl';

import { EntityUpdatedFormValues, useSettingEntityController } from './page.controller';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
 
const EntityPreferencesTab = ({formRef}:{formRef:any}) => {
    const t = useTranslations();
    const { initialValues, validationSchema, setEntityDataAction, fields, pending } = useSettingEntityController();
    const { user } = useAuth()
    const { currentEntity } = useEntity()
     return (
        <>
           
            <Typography variant="h4" component="h1" align="left" sx={{ textAlign: 'left' }} gutterBottom>
                {t('entity.tabs.tab1.titleAbout')}
            </Typography>
            <Typography variant="subtitle1" align="left" color="text.secondary" sx={{ mb: 4, textAlign: 'left' }}>                
                  {t('entity.tabs.tab1.titleAbout')}
            </Typography>
            <GenericForm<EntityUpdatedFormValues>
                column={2}
                disabled={!user?.id || !currentEntity || pending}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={setEntityDataAction}
                fields={fields as FormField[]}
                submitButtonText={t('core.button.save')}
                enableReinitialize
                formRef={formRef}
                hideBtn={true}
            />
            
        </>
    );
};

export default EntityPreferencesTab;
