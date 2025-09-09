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
import { CancelOutlined } from '@mui/icons-material';
import { CustomTypography } from '../Text/CustomTypography';

interface InfoModalProps {
    title: string
    description: string
    cancelBtn?: boolean
}
const InfoModal = ({ title, description, cancelBtn = true }: InfoModalProps): React.JSX.Element => {
    const { open, closeModal } = useCommonModal()
    const theme = useTheme()
    const t = useTranslations()
    // Handler for closing the dialog

    const handleClose = (event: any, reason: 'backdropClick' | 'escapeKeyDown' | 'manual') => {
        if (reason !== 'backdropClick')
            closeModal(CommonModalType.DELETE);
        closeModal(CommonModalType.INFO);
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
                {cancelBtn && <SassButton
                    color="primary"
                    variant="outlined"
                    onClick={(e) => handleClose(e, 'manual')}
                    size='small'
               
                >
                    {t('core.button.accept')}
                </SassButton>}

            </DialogActions>
        </Dialog>
    );
};

export default InfoModal