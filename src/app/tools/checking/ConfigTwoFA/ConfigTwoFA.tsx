/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
    Box,
    Divider,
    Typography
    ,

} from '@mui/material';

import { useTranslations } from 'next-intl';
import { useCommonModal } from '@/hooks/useCommonModal';
import { useCheck } from '../page.context';
import BoxLoader from '@/components/common/BoxLoader';
import SixDigitCodeInput from './SixDigitCodeInput';

const ConfigTwoFA = () => {
    const { } = useCheck()
    const t = useTranslations()
    const { open, openModal, closeModal } = useCommonModal()
    const [qr, setQr] = useState(false)


    return (
        <Box sx={{ p: 2, maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body1" fontWeight={'bold'} fontSize={20} > {t('twoFactor.configDevice')} </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1" fontWeight={'bold'} fontSize={18} > {t('twoFactor.step1')} </Typography>
                <Typography variant="body1" fontSize={16} color='textSecondary' > {t('twoFactor.step1Text1')} </Typography>
                <Typography variant="body1" fontSize={16} color='textSecondary' > {t('twoFactor.step1Text2')} </Typography>
            </Box>
            {qr && <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={1}>
                <Typography variant="body1" fontSize={16} fontWeight={'bold'} > {t('twoFactor.step1Title1')} </Typography>
                <Typography variant="body1" fontSize={16} fontWeight={'bold'} > {t('twoFactor.step1Title2')} </Typography>
                <Box boxShadow={'0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)'} width={200} height={200} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                    <BoxLoader message=' ' />
                </Box>
                <Typography onClick={() => setQr(false)} variant="body1" fontSize={16} fontWeight={'bold'} color='primary' > {t('twoFactor.noScanner')} </Typography>
            </Box>}

            {!qr && <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={3}>
                <Box bgcolor={theme => theme.palette.secondary.dark} width={'100%'} height={40} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Typography variant="body1" fontSize={16} fontWeight={'bold'} textTransform={'uppercase'}  >czcasdasdas</Typography>
                </Box>
                <Box boxShadow={'0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)'} width={'100%'} height={40} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Typography variant="body1" fontSize={16}   > {t('twoFactor.copyClave')} </Typography>
                </Box>
                <Typography onClick={() => setQr(true)} variant="body1" fontSize={16} fontWeight={'bold'} color='primary' > {t('twoFactor.scannerQR')} </Typography>
            </Box>}
            <Divider />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body1" fontWeight={'bold'} fontSize={18} > {t('twoFactor.step4Title1')} </Typography>
                <Typography variant="body1" fontSize={16} color='textSecondary' > {t('twoFactor.step2Text1')} </Typography>
                <SixDigitCodeInput />
            </Box>







        </Box>
    );
};

export default ConfigTwoFA;