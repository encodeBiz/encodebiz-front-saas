import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useTranslations } from 'next-intl';

interface ConfirmProps {
    word?: string
    title: string
    label?: string
    description: string
    codeValidator?: boolean
    isLoading?: boolean
    onOKAction: (args: any) => void

}
const ConfirmModal = ({ word, title, label, description, isLoading = false, codeValidator = false, onOKAction }: ConfirmProps): React.JSX.Element => {
    const { open, closeModal } = useCommonModal()
    const [confirmationText, setConfirmationText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
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
    const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown' | 'manual') => {
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
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ mb: 3 }}>
                    {description}
                </DialogContentText>

                {codeValidator && <Box>
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
                </Box>}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={(e) => handleClose(e, 'manual')}
                    disabled={isLoading}
                >
                    {t('core.button.cancel')}
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={codeValidator && confirmationText !== requiredText}
                    color="error"
                    variant="contained"
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    {codeValidator?t('core.button.submit'):t('core.button.delete')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal