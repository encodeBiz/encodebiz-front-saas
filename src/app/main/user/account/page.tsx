
'use client'
import React from 'react';
import {
    Container,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import GenericTabs from '@/components/common/tabs/GenericTabs';
import { useUserAccountController } from './page.controller';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';

const AccountPreferencesPage = () => {
    const t = useTranslations();
    const { tabsRender } = useUserAccountController();
    const {open, closeModal} = useCommonModal()
    return (
        <Container maxWidth="xl">
            <HeaderPage
                title={t('account.title')}
            >
                <GenericTabs
                    tabs={tabsRender}
                />
            </HeaderPage>

            {open.open && open.type == CommonModalType.RECOVERY&& <ConfirmModal
                title={t('core.recovery.modalTitle')}
                description={t('core.recovery.modalTitle2')}
                textBtn={t('core.recovery.ok')}
                cancelBtn={false}
                onOKAction={() => {
                    closeModal(CommonModalType.RECOVERY)
                   
                }}
            />}
        </Container>
    );
};

export default AccountPreferencesPage;
