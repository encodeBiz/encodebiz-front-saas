
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
import { TabItem, useSettingEntityController } from './page.controller';
import EntityPreferencesTab from './tabs/tabEntity/tabEntity';
import BrandPreferencesPage from './tabs/tabBranding/tabBranding';
import BillingPreferencesPage from './tabs/tabBilling/tabBilling';
import RenuewPreferencesPage from './tabs/tabRenuew/tabRenuew';
import FacturasPreferencesPage from './tabs/tabFacturas/tabFacturas';
import CollaboratorsPreferencesPage from './tabs/tabCollaborators/tabCollaborators';
import { useEntity } from '@/hooks/useEntity';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { useAuth } from '@/hooks/useAuth';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import { createSlug } from '@/lib/common/String';
import { useFormStatus } from '@/hooks/useFormStatus';
import { Save } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';

const EntityPreferencesPage = () => {
    const t = useTranslations();
    const { user } = useAuth()
    const { currentEntity, } = useEntity()
    const { openModal, open } = useCommonModal()
    const { handleDeleteEntity, pending } = useSettingEntityController()
    const formRef = useRef(null)
    const { formStatus } = useFormStatus()
    const searchParams = useSearchParams()
    let tab = 0
    if (searchParams.get('tab')) {
        if (searchParams.get('tab') === 'company') tab = 0
        if (searchParams.get('tab') === 'branding') tab = 1
        if (searchParams.get('tab') === 'billing') tab = 2
    }

    const tabsRender: TabItem[] = [
        {
            label: <Badge color="warning" variant="dot" badgeContent={currentEntity?.entity.legal?.legalName ? 0 : 1}>
                {`${t("entity.tabs.tab1.title")}`}
            </Badge>,
            content: <EntityPreferencesTab formRef={formRef} />,
        },
        {
            label: <Badge color="warning" variant="dot" badgeContent={currentEntity?.entity.branding?.textColor ? 0 : 1}>{t("entity.tabs.tab2.title")}</Badge>,
            content: <BrandPreferencesPage formRef={formRef} />,

        }, {
            label: <Badge color="warning" variant="dot" badgeContent={!currentEntity?.entity.billingConfig?.payment_method || currentEntity?.entity.billingConfig?.payment_method?.length === 0 ? 1 : 0}>{t("entity.tabs.tab3.title")}</Badge>,
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

    const handleExternalSubmit = () => {
        if (formRef.current) {
            (formRef.current as any).submitForm()
        }
    }

    return (
        <Container maxWidth="xl">
            <HeaderPage
                actions={
                    <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
                        <SassButton
                            disabled={!formStatus?.isValid || formStatus?.isSubmitting}
                            onClick={handleExternalSubmit}
                            variant='contained'
                            startIcon={<Save />}
                        > {t('core.button.saveChanges')}</SassButton>
                    </Box>
                }
                title={t('entity.title')}
            >{currentEntity?.role === 'owner' &&
                <GenericTabs
                    defaultTab={tab}
                    fullWidth
                    tabs={tabsRender}
                />
                }
            </HeaderPage>

            <Box display={'flex'} justifyContent={'flex-start'} alignItems='flex-start' sx={{ width: '100%', mt: 6 }}>
                <SassButton disabled={!user?.id || !currentEntity} onClick={() => openModal(CommonModalType.DELETE, { entityId: currentEntity?.entity.id })} variant='contained' color='error' >{t('entity.tabs.tab2.btn')}</SassButton>
            </Box>

            {CommonModalType.DELETE == open.type && open.open && <ConfirmModal
                codeValidator
                isLoading={pending}
                word={createSlug(currentEntity?.entity.name as string ?? '')}
                title={t('entity.tabs.tab1.deleteConfirmModalTitle')}
                description={t('entity.tabs.tab1.deleteConfirmModalTitle2')}
                label={t('entity.tabs.tab1.deleteConfirmModalTitle2')}
                onOKAction={(args: { entityId: string }) => handleDeleteEntity(args.entityId)}
            />}
        </Container>
    );
};

export default EntityPreferencesPage;
