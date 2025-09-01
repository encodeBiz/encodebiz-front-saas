
'use client'
import React from 'react';
import {
    Badge,
    Container,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import GenericTabs from '@/components/common/tabs/GenericTabs';
import { TabItem } from './page.controller';
import { useEntity } from '@/hooks/useEntity';
import { useSearchParams } from 'next/navigation';
import WebHookTab from './tabs/tabWebHook/tabWebHook';

const EntityPreferencesPage = () => {
    const t = useTranslations();
    const { currentEntity, } = useEntity()

    const searchParams = useSearchParams()
    let tab = 0
    if (searchParams.get('tab')) {
        if (searchParams.get('tab') === 'webhook') tab = 0
    }

    const tabsRender: TabItem[] = [
        {
            label: <Badge color="warning" variant="dot" badgeContent={currentEntity?.entity.legal?.legalName ? 0 : 1}>
                {`${t("integration.tabs.tab1.title")}`}
            </Badge>,
            content: <WebHookTab />,
        }

    ];



    return (
        <Container maxWidth="xl">
            <HeaderPage

                title={t('integration.title')}
            >{currentEntity?.role === 'owner' &&
                <GenericTabs
                    defaultTab={tab}
                    fullWidth
                    tabs={tabsRender}
                />
                }
            </HeaderPage>


        </Container>
    );
};

export default EntityPreferencesPage;
