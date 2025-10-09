/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { } from 'react';
import {
    Box,
    CardContent,
    Typography
    ,

} from '@mui/material';

import {

    PlayCircleOutline,
    StopCircleOutlined
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useCommonModal } from '@/hooks/useCommonModal';
import Image from 'next/image';
import { SassButton } from '@/components/common/buttons/GenericButton';
import image from '../../../../../public/assets/images/checkex.png'
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { useCheck } from '../page.context';
import { CommonModalType } from '@/contexts/commonModalContext';
const Check = () => {
    const { checkAction, setCheckAction, restAction, setRestAction, currentBranch, createLogAction, entity, employee, pendingStatus, sessionData, branchList } = useCheck()
    const t = useTranslations()
    const { open, openModal, closeModal } = useCommonModal()


    return (
        <Box sx={{ p: 2, maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                {entity?.branding?.logo && <Image style={{ borderRadius: 4, background: '#E9E8F5' }} src={entity?.branding?.logo} width={160} height={80} alt='' />}
            </Box>

            <Typography variant="body1" fontWeight={'bold'} fontSize={22} > {t('checking.title')} </Typography>

            <Box sx={{ p: 0,width:'100%',  margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box  >
                    <Typography  color="#76777D" variant="body1" fontSize={18} > {t('checking.logDay')} </Typography>
                    <SassButton
                        sx={{
                            borderRadius: 4, textTransform: 'uppercase', mt: 1,
                            px: 2, height: 73, maxWidth: 335, fontSize: 20
                        }}
                        disabled={restAction == 'restin' || pendingStatus} variant='contained' color='primary'
                        onClick={() => {
                            if ((!sessionData?.branchId && branchList.length > 0) || (checkAction === 'checkin' && branchList.length > 0))
                                openModal(CommonModalType.BRANCH_SELECTED)
                            else {
                                createLogAction(checkAction === 'checkin' ? 'checkout' : 'checkin', () => {
                                    setCheckAction(checkAction === 'checkin' ? 'checkout' : 'checkin')
                                })
                            }
                        }} fullWidth
                        startIcon={checkAction === 'checkin' ? <StopCircleOutlined style={{ fontSize: 50 }} sx={{ fontSize: 50, width: 50 }} color={restAction == 'restin' || pendingStatus ? 'disabled' : 'error'} /> : <PlayCircleOutline style={{ fontSize: 50 }} sx={{ fontSize: 50, color: restAction == 'restin' || pendingStatus ? 'disabled' : "#7ADF7F" }} />}
                    >{checkAction === 'checkout' ? t('checking.startJornada') : t('checking.endJornada')}</SassButton>
                </Box>


                <Box>
                    <Typography color="#76777D" variant="body1" fontSize={18} > {t('checking.controlDay')} </Typography>
                    <SassButton
                        sx={{
                            borderRadius: 4, textTransform: 'uppercase', mt: 1,
                            px: 2, height: 73, maxWidth: 335, fontSize: 20, color: "#1C1B1D"
                        }}
                        disabled={checkAction === 'checkout' || pendingStatus} variant='outlined' color='primary'
                        onClick={() => {
                            createLogAction(restAction === 'restin' ? 'restout' : 'restin', () => {
                                setRestAction(restAction === 'restin' ? 'restout' : 'restin')
                            })
                        }} fullWidth
                        startIcon={restAction === 'restin' ? <StopCircleOutlined style={{ fontSize: 50 }} sx={{ fontSize: 50 }} color={checkAction === 'checkout' || pendingStatus ? 'disabled' : 'error'} /> : <PlayCircleOutline style={{ fontSize: 50 }} sx={{ fontSize: 50, color: checkAction === 'checkout' || pendingStatus ? 'disabled' : "#7ADF7F" }} />}
                    >{restAction === 'restout' ? t('checking.startDescanso') : t('checking.endDescanso')}</SassButton>
                </Box>
            </Box>



            {employee && <Box sx={{ width: "100%", p: 2, mt: 2, mb: 2, boxShadow: '0px 2.5px 4px rgba(0, 0, 0, 0.25)', }}>
                <Typography textTransform={'uppercase'} variant="body1" color='#1C1B1D' fontSize={18} fontWeight={500} > {employee.fullName}</Typography>
                {employee?.jobTitle && <Typography color="#76777D" variant="body1" fontSize={18} fontWeight={500}  >{employee?.jobTitle}</Typography>}
                <Typography color="#76777D" variant="body1" fontSize={18} fontWeight={500}  > {currentBranch?.name}</Typography>
            </Box>}

        </Box>
    );
};

export default Check;
