
'use client'
import React from 'react';
import {
    Container,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import GenericTabs from '@/components/common/tabs/GenericTabs';
import { useUserAccountController } from './page.controller';

const AccountPreferencesPage = () => {
    const t = useTranslations();
    const { tabsRender } = useUserAccountController();

    return (
        <Container maxWidth="xl">
            <HeaderPage
                title={t('account.title')}
            >
                <GenericTabs
                    tabs={tabsRender}
                />
            </HeaderPage>
        </Container>
    );
};

export default AccountPreferencesPage;
