import React, { ReactNode } from 'react';
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
import { SassButton } from '../buttons/GenericButton';
import { CustomTypography } from '../Text/CustomTypography';
import { CustomIconBtn } from '@/components/icons/CustomIconBtn';

interface InfoModalProps {
    title?: string
    htmlDescription?: ReactNode
    description?: string
    cancelBtn?: boolean
    closeBtn?: boolean
    closeIcon?: boolean
    centerBtn?: boolean
    btnFill?: boolean
    onClose?: (text?: string) => void
    btnText?: string
    extraText?: string
    btnCloseText?: string

    decisiveAction?: boolean
}
const InfoModal = ({ title, description, decisiveAction = false, htmlDescription, onClose, btnText, closeBtn, btnCloseText, centerBtn, extraText, closeIcon = false, btnFill = false,
    cancelBtn = true }: InfoModalProps): React.JSX.Element => {
    const { open, closeModal } = useCommonModal()
    const t = useTranslations()
    const theme = useTheme()
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
            maxWidth="md"
            slotProps={{ paper: { sx: { p: 2, borderRadius: 2, maxWidth: 900 } } }}
        >
            {title && <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                    <CustomTypography >{title}</CustomTypography>
                </Box>
                {closeIcon && <CustomIconBtn
                    onClick={() => {
                        if(!decisiveAction)
                            closeModal(CommonModalType.INFO)
                        else
                           if (typeof onClose === 'function') onClose('')
                    }}
                    color={theme.palette.primary.main}
                />}
            </DialogTitle>}
            <DialogContent>
                {(description || extraText) && <DialogContentText id="alert-dialog-description" sx={{ mb: 3 }}>
                    <Typography variant='body1'>{description}</Typography>
                    {extraText && <Typography mt={1} color='primary' variant='body1'>{extraText}</Typography>}
                </DialogContentText>}

                {htmlDescription}
            </DialogContent>
            <DialogActions >

                {!decisiveAction && <Box width={'100%'} display={'center'} alignItems={centerBtn ? 'center' : 'flex-end'} justifyContent={centerBtn ? 'center' : 'flex-end'}>
                    {cancelBtn && <SassButton
                        color="primary"
                        variant={btnFill ? "contained" : "outlined"}
                        onClick={(e) => handleClose(e, 'manual')}
                        size='small'

                    >
                        {btnText ? btnText : t('core.button.accept')}
                    </SassButton>}

                    {closeBtn && <SassButton
                        color="primary"
                        variant="contained"
                        onClick={() => closeModal(CommonModalType.INFO)}
                        size='small'

                    >
                        {btnCloseText ? btnCloseText : t('core.button.accept')}
                    </SassButton>}

                    {centerBtn && <SassButton
                        color="primary"
                        sx={{ width: 139 }}
                        variant="contained"
                        onClick={(e) => handleClose(e, 'manual')}
                        size='small'

                    >
                        {btnText ? btnText : t('core.button.accept')}
                    </SassButton>}
                </Box>}

                {decisiveAction && <Box width={'100%'} display={'flex'} gap={1} alignItems={centerBtn ? 'center' : 'flex-end'} justifyContent={centerBtn ? 'center' : 'flex-end'}>


                    <SassButton
                        color="error"
                        variant="contained"
                        onClick={() => {
                            if (typeof onClose === 'function') onClose('denied')
                        }}
                        size='small'

                    >
                        {btnCloseText ? btnCloseText : t('core.button.accept')}
                    </SassButton>

                    <SassButton
                        color="primary"
                        sx={{ width: 139 }}
                        variant="contained"
                        onClick={() => {
                            if (typeof onClose === 'function') onClose('valid')
                        }}
                        size='small'
                    >
                        {btnText ? btnText : t('core.button.accept')}
                    </SassButton>
                </Box>}
            </DialogActions>
        </Dialog>
    );
};

export default InfoModal
