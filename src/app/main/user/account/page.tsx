
'use client'
import React from 'react';
import {
    Container,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import GenericTabs from '@/components/common/tabs/GenericTabs';
import { useUserAccountController } from './page.controller';

const AccountPreferencesPage = () => {
    const t = useTranslations();
    const { tabsRender } = useUserAccountController();

    return (
        <Container maxWidth="xl">
            <PresentationCard
                title={t('account.title')}
            >
                <GenericTabs
                    tabs={tabsRender}
                />
            </PresentationCard>
        </Container>
    );
};

export default AccountPreferencesPage;
