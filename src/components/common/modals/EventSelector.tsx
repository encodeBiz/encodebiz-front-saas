import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    List,
    ListItemButton,
    ListItemText
} from '@mui/material';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useTranslations } from 'next-intl';
import { SassButton } from '../buttons/GenericButton';
import { CheckOutlined } from '@mui/icons-material';
import { CustomTypography } from '../Text/CustomTypography';
import { IEvent } from '@/domain/features/passinbiz/IEvent';

interface EventSelectorProps {
    eventList: Array<IEvent>
    onOKAction: (event: IEvent) => void

}
const EventSelectorModal = ({ eventList, onOKAction }: EventSelectorProps): React.JSX.Element => {
    const { open, closeModal } = useCommonModal()
    const t = useTranslations()
    const [eventSelected, setEventSelected] = useState<IEvent>()
    return (
        <Dialog
            open={open.open}
            //onClose={() => closeModal(CommonModalType.EVENT_SELECTED)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="sm"
            scroll={'paper'}
            slotProps={{ paper: { sx: { p: 2, borderRadius: 2 } } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                    <CustomTypography >{t('scan.titleEvent')}</CustomTypography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <List component="nav" aria-label="main mailbox folders">
                    {eventList.map((e, i) => <ListItemButton key={i}
                        selected={eventSelected?.id === e.id}
                        onClick={() => setEventSelected(e)}
                    >
                        <ListItemText primary={e.name} secondary={e.address} />
                    </ListItemButton>)}
                </List>
            </DialogContent>
            <DialogActions>
                <SassButton
                    onClick={() => {
                        onOKAction(eventSelected as IEvent)
                        closeModal(CommonModalType.EVENT_SELECTED)
                    }}
                    disabled={!eventSelected}
                    color="error"
                    size='small'
                    variant="contained"
                    startIcon={<CheckOutlined />}
                >
                    {t('scan.selected')}
                </SassButton>
            </DialogActions>
        </Dialog>
    );
};

export default EventSelectorModal