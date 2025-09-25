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
import { useCheck } from './Check.controller';
import { useCommonModal } from '@/hooks/useCommonModal';
import Image from 'next/image';
import { SassButton } from '@/components/common/buttons/GenericButton';
import image from '../../../../../public/assets/images/checkex.png'
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { karla } from '@/config/fonts/google_fonts';
const Check = () => {
    const { startJornada, setStartJornada, startDescanso, setStartDescanso, disabledJornada } = useCheck()
    const t = useTranslations()
    const { open, openModal, closeModal } = useCommonModal()


    return (
        <Box sx={{ p: 2, maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                <Image style={{ borderRadius: 4, background: '#E9E8F5' }} src={image} width={80} height={80} alt='' />
            </Box>

            <Typography variant="body1" fontWeight={'bold'} fontSize={22} > {t('checking.title')} </Typography>

            <Box>
                <Typography variant="body1" fontSize={18} > {t('checking.logDay')} </Typography>
                <SassButton
                 sx={{
                    borderRadius:4,textTransform:'uppercase',
                    px:2, height:73
                }}
                disabled={disabledJornada} variant='contained' color='primary'
                    onClick={() => setStartJornada(!startJornada)} fullWidth
                    startIcon={startJornada ? <StopCircleOutlined  style={{fontSize:50}} sx={{fontSize:50, width:50}} color='error' /> : <PlayCircleOutline style={{fontSize:50}} sx={{fontSize:50, color:"#7ADF7F"}} />}
                >{!startJornada ? t('checking.startJornada') : t('checking.endJornada')}</SassButton>
            </Box>


            <Box>
                <Typography variant="body1" fontSize={18} > {t('checking.logDay')} </Typography>
                <SassButton
                sx={{
                    borderRadius:4,textTransform:'uppercase',
                    px:2, height:73
                }}
                disabled={!startJornada} variant='outlined' color='primary'
                    onClick={() => setStartDescanso(!startDescanso)} fullWidth
                    startIcon={startDescanso ? <StopCircleOutlined  style={{fontSize:50}} sx={{fontSize:50}} color='error' /> : <PlayCircleOutline  style={{fontSize:50}} sx={{fontSize:50 ,color:"#7ADF7F"}} />}
                >{startJornada ? t('checking.startDescanso') : t('checking.endDescanso')}</SassButton>
            </Box>


            <BorderBox sx={{ width: "100%", p: 2, mt: 2, mb: 2, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
                <Typography variant="body1" fontSize={18}  > Yasiel Perez Villazon </Typography>
                                <Typography variant="body1" color='textSecondary' fontSize={18}  >AO Smith - Carabanchel Alto</Typography>

            </BorderBox>





        </Box>
    );
};

export default Check;