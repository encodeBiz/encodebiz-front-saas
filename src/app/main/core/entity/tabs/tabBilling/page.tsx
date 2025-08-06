
'use client'
import React from 'react';
import { useTranslations } from 'next-intl';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import { useSettingEntityController } from './page.controller';
import image from '../../../../../../../public/assets/images/billing-process.webp'
const BillingPreferencesPage = () => {
    const t = useTranslations();
    const { configBillingAction } = useSettingEntityController();
   
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
