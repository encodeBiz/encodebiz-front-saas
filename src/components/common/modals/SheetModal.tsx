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
    Typography,
    ListItemIcon
} from '@mui/material';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useTranslations } from 'next-intl';
import { TransitionProps } from '@mui/material/transitions';
import { CustomIconBtn } from '@/components/icons/CustomIconBtn';
import { CustomTypography } from '../Text/CustomTypography';
import { SassButton } from '../buttons/GenericButton';
import {  Warning } from '@mui/icons-material';
import { BorderBox } from '../tabs/BorderBox';

interface SheetModalProps {
    word?: string
    title: string
    label?: string
    textBtn?: string
    description: string
    textPoint?: Array<{ text: string, link: string }>
    codeValidator?: boolean
    isLoading?: boolean
    onOKAction: (args: any) => void
    type?: CommonModalType
    hideCancel?: boolean
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const SheetModalModal = ({ title,hideCancel=false, textBtn, description, textPoint = [], type = CommonModalType.DELETE, isLoading = false, onOKAction }: SheetModalProps): React.JSX.Element => {
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
                <BorderBox sx={{ p: 1 }}>
                    {textPoint.length > 0 && <List dense={true}>
                        {textPoint.map((e, i) => <ListItem key={i}>
                            <ListItemIcon><Warning sx={{color:(theme)=>theme.palette.warning.main}} color='warning' /></ListItemIcon>
                            <ListItemText
                                primary={<Typography variant='body1'>{e.text}</Typography>}
                            />
                        </ListItem>)}
                    </List>}
                </BorderBox>
            </DialogContent>
            <DialogActions>

                {!hideCancel && <SassButton
                    onClick={(e) => handleClose(e, 'manual')}
                    disabled={isLoading}
                    variant="outlined"
                    size='small'
                    startIcon={null}
                    color='primary'
                >
                    {t('core.button.cancel')}
                </SassButton>}
                <SassButton
                    onClick={handleConfirm}
                    disabled={isLoading}
                    variant="contained"
                    color='primary'
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    {textBtn ? textBtn : t('core.button.ok')}
                </SassButton>
            </DialogActions>
        </Dialog>
    );
};

export default SheetModalModal