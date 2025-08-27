/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { CustomIconBtn } from '@/components/icons/CustomIconBtn';
import { SassButton } from '../buttons/GenericButton';
import { BorderBox } from '../tabs/BorderBox';
import { CustomTypography } from '../Text/CustomTypography';
import { useTranslations } from 'next-intl';
import { IEvent } from '@/domain/features/passinbiz/IEvent';
import { search } from '@/services/passinbiz/event.service';
import { useEntity } from '@/hooks/useEntity';
import { Article } from '@mui/icons-material';
// Use public URL for static assets in Next.js
interface ICSVConfigModal {
  open: boolean
  onClose: () => void
  onConfirm: (args: { type: 'event' | 'credential', eventId?: string }) => void
}
const CSVConfigModal = ({ open, onClose, onConfirm }: ICSVConfigModal) => {
  const theme = useTheme()
  const t = useTranslations()
  const { currentEntity } = useEntity()
  const [type, seType] = useState<string>('credencial')
  const [eventSelected, setEventSelected] = useState<IEvent>()
  const [eventList, setEventList] = useState<Array<IEvent>>([])
  const [searchInput, setSearchInput] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Array<IEvent>>([]);

  const inicializeEvent = async () => {
    setEventList(await search(currentEntity?.entity.id as string, { ...{} as any, limit: 100 }))
  }

  useEffect(() => {
    if (currentEntity?.entity.id)
      inicializeEvent()
  }, [currentEntity?.entity.id])

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    const availableUsers = eventList.filter(event =>
      eventSelected?.id !== event.id
    );
    const filtered = availableUsers.filter(event =>
      event.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    setFilteredEvents(filtered);
  }, [eventList, eventSelected, searchInput]);

  const handleSelected = () => {
    if (eventSelected) {
      handleClose();
      onConfirm({
        type: type as 'event' | 'credential',
        eventId: eventSelected?.id
      })
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth slotProps={{ paper: { sx: { p: 2, borderRadius: 2 } } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
          <Typography variant='h5'>{t('holders.importSCVTitle')}</Typography>
          <Typography variant='body1'>{t('holders.importSCVText')}</Typography>
        </Box>
        <CustomIconBtn
          onClick={handleClose}
          color={theme.palette.primary.main}
        />
      </DialogTitle>
      <DialogContent>
        <BorderBox sx={{ mt: 2, p: 4 }}>
          <CustomTypography sx={{ mb: 2 }}>{t('holders.selectType')}</CustomTypography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="role-select-label">{t('core.label.typePass')}</InputLabel>
            <Select
              labelId="role-select-label"
              value={type}
              label={t('core.label.typePass')}
              onChange={(e) => seType(e.target.value)}
            >
              {[
                { value: 'credential', label: t('core.label.credencial') },
                { value: 'event', label: t('core.label.event') }
              ].map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {type === 'event' && <Autocomplete
            options={filteredEvents}
            getOptionLabel={(option) => `${option.name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('core.label.event')}
                fullWidth
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option.name}
              </Box>
            )}
            onChange={(event, newValue) => setEventSelected(newValue as IEvent)}
            value={eventSelected}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />}


        </BorderBox>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
        <SassButton
          onClick={handleSelected}
          variant="contained"
          size='small'
          disabled={(type === 'credential') ? !type : (!type || !eventSelected)}
          startIcon={<Article />}
        >
          {t('core.button.importCSV')}
        </SassButton>
      </DialogActions>
    </Dialog>

  );
};

export default CSVConfigModal;
