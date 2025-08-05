
'use client'
import React from 'react';
import { useTranslations } from 'next-intl';
import { BrandFormValues, useSettingEntityController } from './page.controller';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';

const BrandPreferencesPage = () => {
    const t = useTranslations();
    const { changeBrandAction,pending, fields2,initialBrandValues,brandValidationSchema } = useSettingEntityController();
 const { user } = useAuth()
    const { currentEntity } = useEntity()
    return (
          <>

                <GenericForm<BrandFormValues>
                    column={3}
                    disabled={!user?.id || !currentEntity || pending}
                    initialValues={initialBrandValues}
                    validationSchema={brandValidationSchema}
                    onSubmit={changeBrandAction}
                    fields={fields2 as FormField[]}
                    submitButtonText={t('core.button.save')}
                    enableReinitialize
                />
            </>
    );
};

export default BrandPreferencesPage;
