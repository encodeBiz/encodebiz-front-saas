import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
    Slide,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useTranslations } from 'next-intl';
import { TransitionProps } from '@mui/material/transitions';

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

        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ mb: 3 }}>
                    {description}
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

                <Button
                    onClick={(e) => handleClose(e, 'manual')}
                    disabled={isLoading}
                    variant="outlined"
                >
                    {t('core.button.cancel')}
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    variant="contained"
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    {textBtn ? textBtn : t('core.button.ok')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SheetModalModal