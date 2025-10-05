/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Typography
    ,

} from '@mui/material';

import { useTranslations } from 'next-intl';
import { useCommonModal } from '@/hooks/useCommonModal';
import { useCheck } from '../page.context';
import BoxLoader from '@/components/common/BoxLoader';
import SixDigitCodeInput from './SixDigitCodeInput';
import { CommonModalType } from '@/contexts/commonModalContext';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { enable2AF, verify2AF } from '@/services/checkinbiz/employee.service';
import Image from 'next/image';
import { useLayout } from '@/hooks/useLayout';
import { useToast } from '@/hooks/useToast';

interface ConfigTwoFAType {
    qrImage: string
    secret: string
}

export interface VerifyTwoFAType {
    "message": string
    "token": string,
    "expiresIn": number
}
const ConfigTwoFA = () => {
    const { setToken } = useCheck()
    const t = useTranslations()
    const { open, openModal, closeModal } = useCommonModal()
    const { token } = useCheck()

    const { changeLoaderState } = useLayout()
    const { showToast } = useToast()
    const [qr, setQr] = useState(true)
    const [code, setCode] = useState('')
    const [pending, setPending] = useState(false)
    const [data, setData] = useState<ConfigTwoFAType>()
    const [launch, setLaunch] = useState(false)
    const fetchQRandCode = async () => {
        setPending(true)
        setLaunch(true)
        try {
            const enable2AFData: ConfigTwoFAType = await enable2AF(token)
            setData(enable2AFData)


            setPending(false)
        } catch (error) {
            setPending(false)
        }
    }

    const verifyCode = async () => {
        changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })

        try {
            const data: VerifyTwoFAType = await verify2AF(code, token)
            //setToken(data.token)
            closeModal(CommonModalType.CONFIG2AF)
            openModal(CommonModalType.INFO)
            changeLoaderState({ show: false })
        } catch (error: any) {
            changeLoaderState({ show: false })
            showToast(error.message, 'error')
        }
    }

    useEffect(() => {
        if (token && !launch)
            fetchQRandCode()
    }, [token])


    return (
        <Dialog
            open={open.open}
            onClose={() => closeModal(CommonModalType.CONFIG2AF)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullScreen
            maxWidth="xl"

            slotProps={{ paper: { sx: { p: 0, borderRadius: 2, width: '100%' } } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                    <Typography variant="body1" fontWeight={'bold'} fontSize={20} > {t('twoFactor.configDevice')} </Typography>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 2 }}>
                <Box sx={{ p: 0, maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 2 }}>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body1" fontWeight={'bold'} fontSize={18} > {t('twoFactor.step1')} </Typography>
                        <Typography variant="body1" fontSize={16} color='textSecondary' > {t('twoFactor.step1Text1')} </Typography>
                        <Typography variant="body1" fontSize={16} color='textSecondary' > {t('twoFactor.step1Text2')} </Typography>
                    </Box>
                    {qr && <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={1}>
                        <Typography variant="body1" fontSize={16} fontWeight={'bold'} > {t('twoFactor.step1Title1')} </Typography>
                        <Typography variant="body1" fontSize={16} fontWeight={'bold'} > {t('twoFactor.step1Title2')} </Typography>
                        <Box boxShadow={'0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)'} width={200} height={200} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                            {pending && !data?.qrImage && <BoxLoader message=' ' />}
                            {!pending && data?.qrImage && <Image width={200} height={200} alt='' src={data?.qrImage as string} />}
                        </Box>
                       <Box sx={{cursor:'pointer'}} ><Typography onClick={() => setQr(false)} variant="body1" fontSize={16} fontWeight={'bold'} color='primary' > {t('twoFactor.noScanner')} </Typography></Box>
                    </Box>}

                    {!qr && data?.secret && !pending && <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={3}>
                        <Box bgcolor={theme => theme.palette.secondary.dark} width={'100%'} height={40} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} p={5}>
                            <Typography variant="body1" fontSize={16} fontWeight={'bold'} textTransform={'uppercase'} sx={{ overflowWrap: 'anywhere', textAlign: 'center' }} >{data?.secret}</Typography>
                        </Box>
                        <Box onClick={() => {
                            showToast(t('twoFactor.copyCode'), 'info')
                            navigator.clipboard.writeText(data?.secret as string)
                        }} boxShadow={'0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)'} width={'100%'} height={40} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                            <Typography variant="body1" fontSize={16}   > {t('twoFactor.copyClave')} </Typography>
                        </Box>
                        <Box sx={{cursor:'pointer'}} ><Typography  onClick={() => setQr(true)} variant="body1" fontSize={16} fontWeight={'bold'} color='primary' > {t('twoFactor.scannerQR')} </Typography></Box>
                    </Box>}
                    <Divider />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="body1" fontWeight={'bold'} fontSize={18} > {t('twoFactor.step4Title1')} </Typography>
                        <Typography variant="body1" fontSize={16} color='textSecondary' > {t('twoFactor.step2Text1')} </Typography>
                        <SixDigitCodeInput onCompleted={setCode} />
                    </Box>
                    <SassButton onClick={verifyCode} disabled={code.length != 6} variant='contained' color='primary' >{t('twoFactor.verifyAndContinue')}</SassButton>





                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ConfigTwoFA;