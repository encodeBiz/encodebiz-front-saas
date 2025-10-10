
'use client'
import React from 'react';
import {
    Box,
    Container
} from '@mui/material';
import Check from './Check/Check';
import { useTranslations } from 'next-intl';
import { NorthEastOutlined } from '@mui/icons-material';

import CheckLog from './CheckLog/CheckLog';
import { CheckProvider, useCheck } from './page.context';
import BranchSelectorModal from '@/components/common/modals/BranchSelector';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useCommonModal } from '@/hooks/useCommonModal';
import ConfigTwoFA from './ConfigTwoFA/ConfigTwoFA';
import InfoModal from '@/components/common/modals/InfoModal';
import VerifyTwoFA from './VerifyTwoFA/VerifyTwoFA';
import LocaleSwitcher from '@/components/common/LocaleSwitcher';
import { useStyles } from './page.styles';
 

const Checking = () => {
    const t = useTranslations()
    const { branchList, setSessionData, sessionData, hanldeSelectedBranch,handleRequestLocation } = useCheck()
    const { open, openModal } = useCommonModal()
    const classes = useStyles();

    return (

        <Container maxWidth="sm" sx={{ backgroundColor: '#FFFFFF', height: '100vh', position: 'relative', paddingBottom: 10 }}>

            <Box sx={classes.locale}>
                <LocaleSwitcher rmText={true} />
            </Box>


            <Check />


            <Box onClick={() => openModal(CommonModalType.LOGS)}
                sx={{
                    position: 'fixed',
                    width: '100%',
                    height: 89,
                    left: 0,
                    bottom: 0,
                    /* E-SAAS/sys/light/on-primary-fixed */
                    background: '#001946',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    color: '#FFFFFF',
                }}
            >
                {t('checking.history')}
                <NorthEastOutlined />
            </Box>

            {open.type === CommonModalType.BRANCH_SELECTED && <BranchSelectorModal
                branchList={branchList}
                onOKAction={(branchId) => {
                    hanldeSelectedBranch(branchId.branchId)
                    setSessionData({ ...sessionData as { employeeId: string, entityId: string, branchId: string, }, branchId: branchId.branchId })
                }}
            />}
            {open.type === CommonModalType.LOGS && <CheckLog />}
            {open.type === CommonModalType.CONFIG2AF && <ConfigTwoFA />}
            {open.type === CommonModalType.ADDDEVICE2AF && <VerifyTwoFA />}
            {open.type === CommonModalType.INFO && <InfoModal centerBtn cancelBtn={false} closeBtn={false}
                title={t('twoFactor.newDeviceMessage')} 
                description={t('twoFactor.newDeviceMessageText')}
            />}

            {open.type === CommonModalType.GEO && <InfoModal
                title={t('checking.noGeo')}
                description={t('checking.noGeoText')}
                btnText={t('checking.noGeoBtn')}
                onClose={() => {
                    handleRequestLocation()
                }}
            />}
 
        </Container>

    );
};


const CheckingPage = () => <CheckProvider><Checking /></CheckProvider>
export default CheckingPage;
