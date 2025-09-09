import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    Typography,
    useTheme
} from '@mui/material';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useTranslations } from 'next-intl';
import { CustomIconBtn } from '@/components/icons/CustomIconBtn';
import { SassButton } from '../buttons/GenericButton';
import { CustomTypography } from '../Text/CustomTypography';
import { useEntity } from '@/hooks/useEntity';
import { updateAuth } from '@/services/common/entity.service';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'nextjs-toploader/app';
import { MAIN_ROUTE } from '@/config/routes';
import IUserEntity from '@/domain/auth/IUserEntity';


const WelcomeInviteModal = (): React.JSX.Element => {
    const { open, closeModal } = useCommonModal()
    const theme = useTheme()

    const t = useTranslations()
    const { currentEntity, setCurrentEntity } = useEntity()
    const { user } = useAuth()
    const { push } = useRouter()
    const isGuest = user?.fullName?.trim()?.toLowerCase() === 'guest'
    // Handler for closing the dialog
    const handleWelcomeInvite = async () => {
        await updateAuth(currentEntity?.id as string, user?.id as string)
        setCurrentEntity({...currentEntity,status:'active'} as IUserEntity)
        if (isGuest) push(`/${MAIN_ROUTE}/user/account`)
        closeModal(CommonModalType.WELCOMEGUEST)
    }
    const handleClose = async () => {
        await updateAuth(currentEntity?.id as string, user?.id as string)
        setCurrentEntity({...currentEntity,status:'active'} as IUserEntity)
        if (isGuest) push(`/${MAIN_ROUTE}/user/account`)
        closeModal(CommonModalType.WELCOMEGUEST)
    }
    return (
        <Dialog
            open={open.open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="sm"
            slotProps={{ paper: { sx: { p: 2, borderRadius: 2 } } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                    <CustomTypography >{t('guestModal.title')}</CustomTypography>
                </Box>

                <CustomIconBtn
                    onClick={() => handleClose()}
                    color={theme.palette.primary.main}
                />
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ mb: 3 }}>
                    <Typography variant='body1'>{t('guestModal.text1')}</Typography>
                    {isGuest && <Typography sx={{ mt: 1 }} variant='body1'>{t('guestModal.text2')}</Typography>}
                </DialogContentText>


            </DialogContent>
            <DialogActions>
                <SassButton
                    onClick={handleWelcomeInvite}
                    color="primary"
                    size='small'
                    variant="contained"
                >
                    {isGuest ? t('guestModal.btn') : t('core.button.close')}
                </SassButton>
            </DialogActions>
        </Dialog>
    );
};

export default WelcomeInviteModal