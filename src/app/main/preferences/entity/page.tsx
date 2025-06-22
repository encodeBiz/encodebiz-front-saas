
'use client'
import React from 'react';
import {
    Container,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import GenericTabs from '@/components/common/tabs/GenericTabs';
import { useSettingEntityController } from './page.controller';

const EntityPreferencesPage = () => {
    const t = useTranslations();
    const { tabsRender } = useSettingEntityController();

    return (
        <Container maxWidth="xl">
            <PresentationCard
                title={t('entity.title')}
                description={t('features.entity.create.card.subtitle')}
              
            >
                <GenericTabs
                    tabs={tabsRender}
                />
            </PresentationCard>
        </Container>
    );
};

export default EntityPreferencesPage;
