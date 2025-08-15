
'use client'
import React from 'react';
import { useTranslations } from 'next-intl';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import { useSettingEntityController } from './page.controller';
import image from '../../../../../../../public/assets/images/billing-process.webp'
import { useEntity } from '@/hooks/useEntity';
const BillingPreferencesPage = () => {
    const t = useTranslations();
    const { configBillingAction } = useSettingEntityController();
    const { currentEntity } = useEntity()
    console.log(currentEntity);

    return (
        <>
            <PresentationCard
                title={t('billing.title')}
                description={t('billing.subtitle')}
                image={image}
                disabledBtn={!currentEntity?.entity.legal?.legalName && !currentEntity?.entity.legal?.taxId}
                action1={configBillingAction}
                action1Text={t('entity.tabs.tab3.btn') +' '+ `${Array.isArray(currentEntity?.entity?.billingConfig?.payment_method) && currentEntity?.entity?.billingConfig?.payment_method.length > 0 ? '('+currentEntity?.entity?.billingConfig?.payment_method?.length + ' Método(s) configurado(s))' : ''}`}

            />

        </>
    );
};

export default BillingPreferencesPage;
