
'use client'
import React from 'react';
import {
    Container,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import GenericTabs from '@/components/common/tabs/GenericTabs';
import { TabItem } from './page.controller';
import EntityPreferencesTab from './tabs/tabEntity/page';
import BrandPreferencesPage from './tabs/tabBranding/page';
import BillingPreferencesPage from './tabs/tabBilling/page';
import RenuewPreferencesPage from './tabs/tabRenuew/page';
import FacturasPreferencesPage from './tabs/tabFacturas/page';
import CollaboratorsPreferencesPage from './tabs/tabCollaborators/page';
import { useEntity } from '@/hooks/useEntity';

const EntityPreferencesPage = () => {
    const t = useTranslations();
    const { currentEntity } = useEntity();


    const tabsRender: TabItem[] = [
        {
            label: `${t("entity.tabs.tab1.title")}`,
            content: <EntityPreferencesTab />,
        },
        {
            label: `${t("entity.tabs.tab2.title")}`,
            content: <BrandPreferencesPage />,
        }, {
            label: `${t("entity.tabs.tab3.title")}`,
            content: <BillingPreferencesPage />,
        },
        {
            label: `${t("entity.tabs.tab4.title")}`,
            content: <RenuewPreferencesPage />,
        },
        {
            label: `${t("entity.tabs.tab5.title")}`,
            content: <FacturasPreferencesPage />,
        },
        {
            label: `${t("entity.tabs.tab6.title")}`,
            content: <CollaboratorsPreferencesPage />,
        },

    ];

    return (
        <Container maxWidth="xl">
            <PresentationCard
                title={t('entity.title')}
                description={t('features.entity.create.card.subtitle')}

            >{currentEntity?.role === 'owner' &&
                <GenericTabs
                    tabs={tabsRender}
                />
            }
            </PresentationCard>
        </Container>
    );
};

export default EntityPreferencesPage;
