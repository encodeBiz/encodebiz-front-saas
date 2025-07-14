
'use client'
import React from 'react';
import {
    Box,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useSettingEntityController } from './page.controller';
import { useAuth } from '@/hooks/useAuth';
import { useCommonModal } from '@/hooks/useCommonModal';
import { useEntity } from '@/hooks/useEntity';
import { BaseButton } from '@/components/common/buttons/BaseButton';

const FacturasPreferencesPage = () => {
    const t = useTranslations();
    const { configBillingAction, iframeUrl } = useSettingEntityController();
    const { user } = useAuth()
    const { currentEntity } = useEntity()
    const { openModal } = useCommonModal()
    return (
        <>
            <Box display={'flex'} justifyContent={'center'} alignItems='center' sx={{ width: '100%' }}>
                <BaseButton disabled={!user?.id || !currentEntity} onClick={() => configBillingAction()} variant='contained' color='warning' >{t('entity.tabs.tab3.btn')}</BaseButton>
            </Box>

        </>
    );
};

export default FacturasPreferencesPage;
