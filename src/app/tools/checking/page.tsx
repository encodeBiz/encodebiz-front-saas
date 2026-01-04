
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
import { SassButton } from '@/components/common/buttons/GenericButton';
import UpdateRequest from './UpdateRequest/UpdateRequest';


const Checking = () => {
    const t = useTranslations()
    const { branchList, setSessionData, sessionData, hanldeSelectedBranch, handleRequestLocation } = useCheck()
    const { open, openModal, closeModal } = useCommonModal()
    const classes = useStyles();

    return (

        <Container maxWidth="sm" sx={{ backgroundColor: '#FFFFFF', height: '100vh', position: 'relative', paddingBottom: 10 }}>

            <Box sx={classes.locale}>
                <LocaleSwitcher rmText={true} />
            </Box>
            <Check />
            <Box
                sx={{
                    position: 'fixed',
                    width: '95%',
                    margin: 'auto',
                    height: 89,
                    left: 1,
                    right: 2,
                    bottom: 0,

                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    color: '#FFFFFF',
                }}
            >
                <SassButton fullWidth sx={{ background: '#001946', borderRadius: 2, width: '100%' }} variant='contained' startIcon={<NorthEastOutlined />} onClick={() => openModal(CommonModalType.LOGS)} >
                    {t('checking.history')}
                </SassButton>

                <SassButton fullWidth sx={{ background: '#001946', borderRadius: 2, width: '100%' }} variant='contained' startIcon={<NorthEastOutlined />} onClick={() => openModal(CommonModalType.UPDATEREQUEST)} >
                    {t('checking.requestUpdate')}
                </SassButton>
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
            {open.type === CommonModalType.UPDATEREQUEST && <UpdateRequest />}
            {open.type === CommonModalType.ADDDEVICE2AF && <VerifyTwoFA />}
            {open.type === CommonModalType.INFO && <InfoModal centerBtn cancelBtn={false} closeBtn={false}
                title={t('twoFactor.newDeviceMessage')}
                description={t('twoFactor.newDeviceMessageText')}
            />}

            {open.type === CommonModalType.OUT_RADIUS && <InfoModal centerBtn cancelBtn={false} closeBtn={false}
                title={t('checking.outRadiusTitle')}
                description={t('checking.outRadiusText')}
                onClose={() => {
                    closeModal(CommonModalType.OUT_RADIUS)
                }}
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
