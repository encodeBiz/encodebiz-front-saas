
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
import { useSettingEntityController } from './page.controller';
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
import { useSearchParams } from 'next/navigation';
import { TabItem } from '@/components/common/tabs/BaseTabs';

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
    const tabText = searchParams.get('tab') ?? 'company'
    if (tabText) {
        if (tabText === 'company') tab = 0
        if (tabText === 'branding') tab = 1
        if (tabText === 'billing') tab = 2
        if (tabText === 'subscription') tab = 3
        if (tabText === 'invoice') tab = 4
        if (tabText === 'colaborators') tab = 5
    }
    const tabsRender: TabItem[] = [
        {
            label: <Badge color="warning" variant="dot" badgeContent={currentEntity?.entity.legal?.legalName ? 0 : 1}>
                {`${t("entity.tabs.tab1.title")}`}
            </Badge>,
            content: <EntityPreferencesTab formRef={formRef} />,
            id: 'company'
        },
        {
            label: <Badge color="warning" variant="dot" badgeContent={currentEntity?.entity.branding?.textColor ? 0 : 1}>{t("entity.tabs.tab2.title")}</Badge>,
            content: <BrandPreferencesPage formRef={formRef} />,
            id: 'branding'

        }, {
            label: <Badge color="warning" variant="dot" badgeContent={!currentEntity?.entity.billingConfig?.payment_method || currentEntity?.entity.billingConfig?.payment_method?.length === 0 ? 1 : 0}>{t("entity.tabs.tab3.title")}</Badge>,
            content: <BillingPreferencesPage />,
            id: 'billing'
        },
        {
            label: `${t("entity.tabs.tab4.title")}`,
            content: <RenuewPreferencesPage />,
            id: 'subscription'
        },
        {
            label: `${t("entity.tabs.tab5.title")}`,
            content: <FacturasPreferencesPage />,
            id: 'invoice'
        },
        {
            label: `${t("entity.tabs.tab6.title")}`,
            content: <CollaboratorsPreferencesPage />,
            id: 'colaborators'
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
                isForm
                inTab
                actions={<>{(tabText === 'company' || tabText === 'branding') &&
                    <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
                        <SassButton
                            disabled={!formStatus?.isValid || formStatus?.isSubmitting}
                            onClick={handleExternalSubmit}
                            variant='contained'                             
                        > {t('core.button.save')}</SassButton>
                    </Box>}
                </>}
                title={t('entity.title')}
            >{currentEntity?.role === 'owner' &&
                <GenericTabs
                    defaultTab={tab}
                    fullWidth
                    tabs={tabsRender}
                />
                }
            </HeaderPage>

            {tab === 0 && <Box display={'flex'} justifyContent={'flex-start'} alignItems='flex-start' sx={{ width: '100%', mt: 6 }}>
                <SassButton disabled={!user?.id || !currentEntity} onClick={() => openModal(CommonModalType.DELETE, { entityId: currentEntity?.entity.id })} variant='contained' color='error' >{t('entity.tabs.tab2.btn')}</SassButton>
            </Box>}

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
