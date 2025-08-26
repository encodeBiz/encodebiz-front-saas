import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Box,
    Typography,
    CircularProgress,
    useTheme
} from '@mui/material';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useTranslations } from 'next-intl';
import { CustomIconBtn } from '@/components/icons/CustomIconBtn';
import { SassButton } from '../buttons/GenericButton';
import { TrashIcon } from '../icons/TrashIcon';
import { CancelOutlined } from '@mui/icons-material';
import { CustomTypography } from '../Text/CustomTypography';
import { BorderBox } from '../tabs/BorderBox';

interface ConfirmProps {
    word?: string
    title: string
    label?: string
    textBtn?: string
    description: string
    codeValidator?: boolean
    isLoading?: boolean
    cancelBtn?: boolean
    onOKAction: (args: any) => void

}
const ConfirmModal = ({ word, title, label, textBtn, description, isLoading = false, cancelBtn = true, codeValidator = false, onOKAction }: ConfirmProps): React.JSX.Element => {
    const { open, closeModal } = useCommonModal()
    const theme = useTheme()
    const [confirmationText, setConfirmationText] = useState('');
    const [error, setError] = useState('');
    const requiredText = word; // The word user must type to confirm
    const t = useTranslations()
    const handleConfirm = async () => {
        if (codeValidator) {
            if (confirmationText !== requiredText) {
                setError(`Por favor escribe "${requiredText}" para confirmar`);
                return;
            }
        }

        if (typeof onOKAction === 'function')
            onOKAction(open.args)

    };

    // Handler for closing the dialog
    const handleClose = (event: any, reason: 'backdropClick' | 'escapeKeyDown' | 'manual') => {
        if (reason !== 'backdropClick')
            closeModal(CommonModalType.DELETE);
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

                <CustomIconBtn
                    onClick={() => handleClose(null, 'manual')}
                    color={theme.palette.primary.main}
                />
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ mb: 3 }}>
                    <Typography variant='body1'>{description}</Typography>
                </DialogContentText>

                {codeValidator && <BorderBox sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        {label} <strong>{requiredText}</strong>:
                    </Typography>
                    <TextField
                        autoFocus
                        fullWidth
                        value={confirmationText}
                        onChange={(e) => {
                            setConfirmationText(e.target.value);
                            setError(''); // Clear error when typing
                        }}
                        placeholder={`Escribe ${requiredText} para confirmar`}
                        error={!!error}
                        helperText={error}
                    />
                </BorderBox>}
            </DialogContent>
            <DialogActions>
                {cancelBtn && <SassButton
                    color="primary"
                    variant="outlined"
                    onClick={(e) => handleClose(e, 'manual')}
                    disabled={isLoading}
                    size='small'
                    startIcon={<CancelOutlined />}

                >
                    {t('core.button.cancel')}
                </SassButton>}
                <SassButton
                    onClick={handleConfirm}
                    disabled={codeValidator && confirmationText !== requiredText}
                    color="error"
                    size='small'
                    variant="contained"
                    startIcon={isLoading ? <CircularProgress size={20} /> : <TrashIcon />}
                >
                    {textBtn ? textBtn : codeValidator ? t('core.button.submit') : t('core.button.delete')}
                </SassButton>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal