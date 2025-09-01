
'use client'
import React, { useRef } from 'react';
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
import { SassButton } from '@/components/common/buttons/GenericButton';
import { useFormStatus } from '@/hooks/useFormStatus';
import { Save } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';
import WebHookTab from './tabs/tabWebHook/tabWebHook';

const EntityPreferencesPage = () => {
    const t = useTranslations();
    const { currentEntity, } = useEntity()
    const formRef = useRef(null)
    const { formStatus } = useFormStatus()
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

    const handleExternalSubmit = () => {
        if (formRef.current) {
            (formRef.current as any).submitForm()
        }
    }

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
