
'use client'
import React from 'react';
import {
    Box,
    Container,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import GenericTabs from '@/components/common/tabs/GenericTabs';
import { BrandFormValues, useSettingEntityController } from './page.controller';
import { useAuth } from '@/hooks/useAuth';
import { useCommonModal } from '@/hooks/useCommonModal';
import { useEntity } from '@/hooks/useEntity';
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { BaseButton } from '@/components/common/buttons/BaseButton';

const BillingPreferencesPage = () => {
    const t = useTranslations();
    const { configBillingAction, iframeUrl } = useSettingEntityController();
    const { user } = useAuth()
    const { currentEntity } = useEntity()
    const { openModal } = useCommonModal()
    return (
        <>
            <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' sx={{ width: '100%' }}>
                <BaseButton disabled={!user?.id || !currentEntity} onClick={() => configBillingAction()} variant='contained' color='warning' >{t('entity.tabs.tab3.btn')}</BaseButton>
            </Box>
            <div style={{ marginTop: '20px', border: '1px solid #ccc', height: '400px', width: '100%' }}>
                {/* The key to dynamism is setting the src attribute to the state variable */}
                {iframeUrl && <iframe
                    src={iframeUrl}
                    title="Dynamic Content"
                    width="100%"
                    height="100%"

                    allowFullScreen
                >
                    Your browser does not support iframes.
                </iframe>}
            </div>
        </>
    );
};

export default BillingPreferencesPage;
