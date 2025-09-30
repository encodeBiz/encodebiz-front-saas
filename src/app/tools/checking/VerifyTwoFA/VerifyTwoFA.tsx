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

import { CommonModalType } from '@/contexts/commonModalContext';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { enable2AF, verify2AF } from '@/services/checkinbiz/employee.service';
import Image from 'next/image';
import { useLayout } from '@/hooks/useLayout';
import { useToast } from '@/hooks/useToast';
import SixDigitCodeInput from '../ConfigTwoFA/SixDigitCodeInput';
import { VerifyTwoFAType } from '../ConfigTwoFA/ConfigTwoFA';

const VerifyTwoFA = () => {
    const { setToken } = useCheck()
    const t = useTranslations()
    const { open, openModal, closeModal } = useCommonModal()
    const { token } = useCheck()
    const { changeLoaderState } = useLayout()
    const { showToast } = useToast()
    const [code, setCode] = useState('')

    const verifyCode = async () => {
        changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })

        try {
            const data: VerifyTwoFAType = await verify2AF(code, token)
            setToken(data.token)
            closeModal(CommonModalType.CONFIG2AF)
            openModal(CommonModalType.INFO)
            changeLoaderState({ show: false })
        } catch (error: any) {
            changeLoaderState({ show: false })
            showToast(error.message, 'error')
        }
    }


    return (
        <Dialog
            open={open.open}
            onClose={() => closeModal(CommonModalType.ADDDEVICE2AF)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="lg"
            slotProps={{ paper: { sx: { p: 0, borderRadius: 2, width: '100%' } } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                    <Typography variant="body1" fontWeight={'bold'} fontSize={20} > {t('twoFactor.step4Title1')} </Typography>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 2 }}>
                <Box sx={{ p: 0, maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="body1" fontSize={16} color='textSecondary' > {t('twoFactor.step2Text1')} </Typography>
                        <SixDigitCodeInput onCompleted={setCode} />
                    </Box>
                    <SassButton onClick={verifyCode} disabled={code.length != 6} variant='contained' color='primary' >{t('twoFactor.verifyAndContinue')}</SassButton>


                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default VerifyTwoFA;