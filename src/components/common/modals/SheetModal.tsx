import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
    Slide,
    List,
    ListItem,
    ListItemText,
    Box,
    useTheme,
    Typography
} from '@mui/material';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useTranslations } from 'next-intl';
import { TransitionProps } from '@mui/material/transitions';
import { CustomIconBtn } from '@/components/icons/CustomIconBtn';
import { CustomTypography } from '../Text/CustomTypography';
import { SassButton } from '../buttons/GenericButton';
import { CancelOutlined, CheckOutlined } from '@mui/icons-material';

interface SheetModalProps {
    word?: string
    title: string
    label?: string
    textBtn?: string
    description: string
    textPoint?: Array<string>
    codeValidator?: boolean
    isLoading?: boolean
    onOKAction: (args: any) => void
    type?: CommonModalType
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const SheetModalModal = ({ title, textBtn, description, textPoint = [], type = CommonModalType.DELETE, isLoading = false, onOKAction }: SheetModalProps): React.JSX.Element => {
    const { open, closeModal } = useCommonModal()
    const theme = useTheme()
    const t = useTranslations()
    const handleConfirm = async () => {
        if (typeof onOKAction === 'function')
            onOKAction(open.args)
    };

    // Handler for closing the dialog
    const handleClose = (event: any, reason: 'backdropClick' | 'escapeKeyDown' | 'manual') => {
        if (reason !== 'backdropClick') {
            closeModal(type);
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
            slots={{
                transition: Transition,
            }}
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
                {textPoint.length > 0 && <List dense={true}>
                    {textPoint.map((e, i) => <ListItem key={i}>
                        <ListItemText
                            primary={e}
                        />
                    </ListItem>)}
                </List>}
            </DialogContent>
            <DialogActions>

                <SassButton
                    onClick={(e) => handleClose(e, 'manual')}
                    disabled={isLoading}
                    variant="outlined"
                    size='small'
                    startIcon={<CancelOutlined />}
                    color='primary'
                >
                    {t('core.button.cancel')}
                </SassButton>
                <SassButton
                    onClick={handleConfirm}
                    disabled={isLoading}
                    variant="contained"
                    color='primary'
                    startIcon={isLoading ? <CircularProgress size={20} /> : <CheckOutlined />}
                >
                    {textBtn ? textBtn : t('core.button.ok')}
                </SassButton>
            </DialogActions>
        </Dialog>
    );
};

export default SheetModalModal