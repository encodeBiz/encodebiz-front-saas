/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { } from 'react';
import {
    Box,
    CardContent,
    Typography
    ,

} from '@mui/material';

import {

    CheckCircle,
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
const Check = () => {
    const { checkAction, setCheckAction, restAction, setRestAction, createLogAction, entity, employee, pendingStatus } = useCheck()
    const t = useTranslations()
    const { open, openModal, closeModal } = useCommonModal()


    return (
        <Box sx={{ p: 2, maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                {entity?.branding?.logo && <Image style={{ borderRadius: 4, background: '#E9E8F5' }} src={entity?.branding?.logo} width={160} height={80} alt='' />}
            </Box>

            <Typography variant="body1" fontWeight={'bold'} fontSize={22} > {t('checking.title')} </Typography>

            <Box>
                <Typography variant="body1" fontSize={18} > {t('checking.logDay')} </Typography>
                <SassButton
                    sx={{
                        borderRadius: 4, textTransform: 'uppercase',
                        px: 2, height: 73
                    }}
                    disabled={restAction == 'restin' || pendingStatus} variant='contained' color='primary'
                    onClick={() => {

                        createLogAction(checkAction === 'checkin' ? 'checkout' : 'checkin', () => {
                            setCheckAction(checkAction === 'checkin' ? 'checkout' : 'checkin')
                        })
                    }} fullWidth
                    startIcon={checkAction === 'checkin' ? <StopCircleOutlined style={{ fontSize: 50 }} sx={{ fontSize: 50, width: 50 }} color={restAction == 'restin' || pendingStatus?'disabled':'error'} /> : <PlayCircleOutline style={{ fontSize: 50 }} sx={{ fontSize: 50, color: restAction == 'restin' || pendingStatus?'disabled':"#7ADF7F" }} />}
                >{checkAction === 'checkout' ? t('checking.startJornada') : t('checking.endJornada')}</SassButton>
            </Box>


            <Box>
                <Typography variant="body1" fontSize={18} > {t('checking.logDay')} </Typography>
                <SassButton
                    sx={{
                        borderRadius: 4, textTransform: 'uppercase',
                        px: 2, height: 73
                    }}
                    disabled={checkAction === 'checkout' || pendingStatus} variant='outlined' color='primary'
                    onClick={() => {
                        createLogAction(restAction === 'restin' ? 'restout' : 'restin', () => {
                            setRestAction(restAction === 'restin' ? 'restout' : 'restin')
                        })
                    }} fullWidth
                    startIcon={restAction === 'restin' ? <StopCircleOutlined style={{ fontSize: 50 }} sx={{ fontSize: 50 }} color={checkAction === 'checkout' || pendingStatus?'disabled':'error'} /> : <PlayCircleOutline style={{ fontSize: 50 }} sx={{ fontSize: 50, color: checkAction === 'checkout' || pendingStatus?'disabled':"#7ADF7F" }} />}
                >{restAction === 'restout' ? t('checking.startDescanso') : t('checking.endDescanso')}</SassButton>
            </Box>


            {employee && <BorderBox sx={{ width: "100%", p: 2, mt: 2, mb: 2, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
                <Typography variant="body1" fontSize={18}  > {employee}</Typography>
                {/*employee?.jobTitle && <Typography variant="body1" color='textSecondary' fontSize={18}  >{employee?.jobTitle}</Typography>*/}
            </BorderBox>}





        </Box>
    );
};

export default Check;