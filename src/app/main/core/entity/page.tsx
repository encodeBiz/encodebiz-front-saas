
'use client'
import React, { useEffect, useRef } from 'react';
import {
    Badge,
    Box,
    Container,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import PresentationCard from '@/components/features/dashboard/PresentationCard/PresentationCard';
import GenericTabs from '@/components/common/tabs/GenericTabs';
import { TabItem, useSettingEntityController } from './page.controller';
import EntityPreferencesTab from './tabs/tabEntity/page';
import BrandPreferencesPage from './tabs/tabBranding/page';
import BillingPreferencesPage from './tabs/tabBilling/page';
import RenuewPreferencesPage from './tabs/tabRenuew/page';
import FacturasPreferencesPage from './tabs/tabFacturas/page';
import CollaboratorsPreferencesPage from './tabs/tabCollaborators/page';
import { useEntity } from '@/hooks/useEntity';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { useAuth } from '@/hooks/useAuth';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import { createSlug } from '@/lib/common/String';
import { useFormStatus } from '@/hooks/useFormStatus';

const EntityPreferencesPage = () => {
    const t = useTranslations();
    const { user } = useAuth()
    const { currentEntity } = useEntity()
    const { openModal, open } = useCommonModal()
    const { handleDeleteEntity, pending } = useSettingEntityController()
    const formRef = useRef(null)
    const { formStatus } = useFormStatus()
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
            label: <Badge color="warning" variant="dot" badgeContent={currentEntity?.entity.billingConfig.payment_method.length === 0 ? 1 : 0}>{t("entity.tabs.tab3.title")}</Badge>,
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
            <PresentationCard
                disabledBtn={!formStatus?.isValid || formStatus?.isSubmitting}
                titleBtn={handleExternalSubmit}
                title={t('entity.title')}
            >{currentEntity?.role === 'owner' &&
                <GenericTabs
                    fullWidth
                    tabs={tabsRender}
                />
                }
            </PresentationCard>

            <Box display={'flex'} justifyContent={'flex-start'} alignItems='flex-start' sx={{ width: '100%', mt: 6 }}>
                <SassButton disabled={!user?.id || !currentEntity} onClick={() => openModal(CommonModalType.DELETE, { entityId: currentEntity?.entity.id })} variant='contained' color='warning' >{t('entity.tabs.tab2.btn')}</SassButton>
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
