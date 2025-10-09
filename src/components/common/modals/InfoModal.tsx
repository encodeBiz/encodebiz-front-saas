import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    Typography
} from '@mui/material';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useTranslations } from 'next-intl';
import { SassButton } from '../buttons/GenericButton';
import { CustomTypography } from '../Text/CustomTypography';

interface InfoModalProps {
    title: string
    description: string
    cancelBtn?: boolean
    closeBtn?: boolean
    onClose?: () => void
    btnText?: string
}
const InfoModal = ({ title, description, onClose, btnText, closeBtn,
    cancelBtn = true }: InfoModalProps): React.JSX.Element => {
    const { open, closeModal } = useCommonModal()
    const t = useTranslations()
    // Handler for closing the dialog

    const handleClose = (event: any, reason: 'backdropClick' | 'escapeKeyDown' | 'manual') => {
        if (reason !== 'backdropClick')
            closeModal(CommonModalType.DELETE);
        closeModal(CommonModalType.INFO);

        if (typeof onClose === 'function') {
            onClose()
        }
    };

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
                    <CustomTypography >{title}</CustomTypography>
                </Box>

            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ mb: 3 }}>
                    <Typography variant='body1'>{description}</Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>

                {closeBtn && <SassButton
                    color="primary"
                    variant="outlined"
                    onClick={() => closeModal(CommonModalType.INFO)}
                    size='small'

                >
                    {t('core.button.accept')}
                </SassButton>}

                {cancelBtn && <SassButton
                    color="primary"
                    variant="outlined"
                    onClick={(e) => handleClose(e, 'manual')}
                    size='small'

                >
                    {btnText ? btnText : t('core.button.accept')}
                </SassButton>}

            </DialogActions>
        </Dialog>
    );
};

export default InfoModal