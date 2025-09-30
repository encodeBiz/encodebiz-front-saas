
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


const Checking = () => {
    const t = useTranslations()
    const { setOpenLogs, openLogs, branchList, setSessionData, sessionData } = useCheck()
    const {open} = useCommonModal()
    return (
        
            <Container maxWidth="sm" sx={{ backgroundColor: '#FFFFFF', height: '100vh', position: 'relative', paddingBottom: 10 }}>
                {/** 
            <Box sx={classes.locale}>
                <LocaleSwitcher />
            </Box>
            */}

                {!openLogs && <ConfigTwoFA />}
                {openLogs && <Check />}
                {openLogs && <CheckLog />}

                {openLogs && <Box onClick={() => setOpenLogs(true)}
                    sx={{

                        position: 'absolute',
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
                </Box>}

                {open.type === CommonModalType.BRANCH_SELECTED && <BranchSelectorModal
                                branchList={branchList}
                                onOKAction={(branchId) => setSessionData({...sessionData,branchId:branchId.branchId})}
                            />}
            </Container>
     
    );
};


const CheckingPage = () => <CheckProvider><Checking/></CheckProvider>
export default CheckingPage;
