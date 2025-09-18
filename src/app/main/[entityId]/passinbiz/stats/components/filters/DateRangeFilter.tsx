import { FormControl, InputLabel } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react"; import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    CalendarToday,
    Clear
} from '@mui/icons-material';
import dayjs from 'dayjs';
export const DateRangePicker = ({
    value = { start: null, end: null },
    onChange
}: {
    value: { start: any, end: any },
    onChange: (value: { start: any, end: any }) => void,

}) => {
    console.log(value);

    const [startDate, setStartDate] = useState(value?.start);
    const [endDate, setEndDate] = useState(value?.end);
    const t = useTranslations()

    const handleStartDateChange = (newDate: any) => {
        const updatedStartDate = newDate;
        setStartDate(updatedStartDate);

        // Ensure end date is not before start date
        if (endDate && updatedStartDate && updatedStartDate.isAfter(endDate)) {
            setEndDate(null);
            onChange?.({ start: updatedStartDate, end: null });
        } else {
            onChange?.({ start: updatedStartDate, end: endDate });
        }
    };

    const handleEndDateChange = (newDate: any) => {
        const updatedEndDate = newDate;
        setEndDate(updatedEndDate);
        onChange?.({ start: startDate, end: updatedEndDate });
    };

    const clearDates = () => {
        setStartDate(null);
        setEndDate(null);
        onChange?.({ start: null, end: null });
    };
    return <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="gb-label">{t('stats.type')}</InputLabel>

        <Paper
            elevation={0}
            sx={{
                p: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,

            }}
        >
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" component="h3">
                    Date Range
                </Typography>
                <IconButton
                    onClick={clearDates}
                    size="small"

                    title="Clear dates"
                >
                    <Clear />
                </IconButton>
            </Box>

            <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                <DateTimePicker
                    label={'Inicio'}
                 

                          defaultValue={dayjs(startDate ?? new Date())}
                              value={dayjs(startDate ?? new Date())}
                    onChange={handleStartDateChange}
                    maxDate={endDate || undefined}
                    sx={{ flex: 1 }}
                />

                <DateTimePicker
                    label={'Fin'}
                    defaultValue={dayjs(new Date(endDate))}
                    value={dayjs(new Date(endDate))}
                    onChange={handleEndDateChange}
                    minDateTime={dayjs(startDate)}

                    disabled={!startDate}
                    sx={{ flex: 1 }}
                />
            </Box>
        </Paper>

    </FormControl>
    </LocalizationProvider>
}