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
import { CustomTypography } from '../Text/CustomTypography';
 
interface EventSelectorProps {
    eventList: Array<{name: string, eventId: string}>
    onOKAction: (event: {name: string, eventId: string}) => void

}
const EventSelectorModal = ({ eventList, onOKAction }: EventSelectorProps): React.JSX.Element => {
    const { open, closeModal } = useCommonModal()
    const t = useTranslations()
    const [eventSelected, setEventSelected] = useState<{name: string, eventId: string}>()
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
                        selected={eventSelected?.eventId === e.eventId}
                        onClick={() => setEventSelected(e)}
                    >
                        <ListItemText primary={e.name} />
                    </ListItemButton>)}
                </List>
            </DialogContent>
            <DialogActions>
                <SassButton
                    onClick={() => {
                        onOKAction(eventSelected as {name: string, eventId: string})
                        closeModal(CommonModalType.EVENT_SELECTED)
                    }}
                    disabled={!eventSelected}
                    color="primary"
                    size='small'
                    variant="contained"
                  
                >
                    {t('scan.selected')}
                </SassButton>
            </DialogActions>
        </Dialog>
    );
};

export default EventSelectorModal