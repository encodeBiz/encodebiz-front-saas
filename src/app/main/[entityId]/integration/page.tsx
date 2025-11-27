
'use client'
import React from 'react';
import {
    Badge,
    Box,
    Container,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import GenericTabs from '@/components/common/tabs/GenericTabs';
import { TabItem } from './page.controller';
import { useEntity } from '@/hooks/useEntity';
import { useSearchParams } from 'next/navigation';
import WebHookTab from './tabs/tabWebHook/tabWebHook';
import EmptyState from '@/components/common/EmptyState/EmptyState';

const EntityPreferencesPage = () => {
    const t = useTranslations();
    const { currentEntity, entitySuscription } = useEntity()

    const searchParams = useSearchParams()
    let tab = 0
    if (searchParams.get('tab')) {
        if (searchParams.get('tab') === 'webhook') tab = 0
    }

    const tabsRender: TabItem[] = entitySuscription.filter(e => e.serviceId==='passinbiz' && e.plan!=='freemium').length === 0 ?
     [] : 
     [
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

                <Box sx={{minHeight:100}} display={'flex'} justifyContent={'center'} alignItems={'center'}>{tabsRender.length===0 && <EmptyState/>}</Box>
            </HeaderPage>


        </Container>
    );
};

export default EntityPreferencesPage;
