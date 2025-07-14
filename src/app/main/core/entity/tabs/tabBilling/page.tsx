
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
    const { configBillingAction } = useSettingEntityController();
    const { user } = useAuth()
    const { currentEntity } = useEntity()
    const { openModal } = useCommonModal()
    return (
        <>
            <Box display={'flex'} justifyContent={'center'} alignItems='center' sx={{ width: '100%' }}>
                <BaseButton disabled={!user?.id || !currentEntity} onClick={() => configBillingAction()} variant='contained' color='warning' >{t('entity.tabs.tab3.btn')}</BaseButton>
            </Box>
            
        </>
    );
};

export default BillingPreferencesPage;
