
'use client'
import React from 'react';
import {
    Box,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import { useSettingEntityController } from './page.controller';
import { useAuth } from '@/hooks/useAuth';
import { useCommonModal } from '@/hooks/useCommonModal';
import { useEntity } from '@/hooks/useEntity';
import { BaseButton } from '@/components/common/buttons/BaseButton';
import image from '../../../../../../../public/assets/images/billing-process.webp'
const BillingPreferencesPage = () => {
    const t = useTranslations();
    const { configBillingAction } = useSettingEntityController();
    const { user } = useAuth()
    const { currentEntity } = useEntity()
    const { openModal } = useCommonModal()
    return (
        <>           
            <PresentationCard
                title={t('billing.title')}
                description={t('billing.subtitle')}
                image={image}
                action1={configBillingAction}
                action1Text={t('entity.tabs.tab3.btn')}
              
            />

        </>
    );
};

export default BillingPreferencesPage;
