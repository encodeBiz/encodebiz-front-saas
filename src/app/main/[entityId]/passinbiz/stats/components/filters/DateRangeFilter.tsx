import { FormControl } from "@mui/material";
import { useState } from "react"; import {
    Box
} from '@mui/material';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
export const DateRangePicker = ({
    value = { start: null, end: null },
    onChange
}: {
    value: { start: any, end: any },
    onChange: (value: { start: any, end: any }) => void,

}) => {

    const [startDate, setStartDate] = useState(value?.start);
    const [endDate, setEndDate] = useState(value?.end);

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

        <FormControl sx={{ minWidth: 140 }}>

            <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                <DateTimePicker
                    label={'Inicio'}

                    defaultValue={dayjs(startDate ?? new Date())}
                    value={dayjs(startDate ?? new Date())}
                    onChange={handleStartDateChange}
                    maxDate={dayjs(endDate) || undefined}
                    sx={{ flex: 1 }}

                    slotProps={{
                        textField: {
                            size: 'small'
                        },
                    }}
                />

                <DateTimePicker
                    label={'Fin'}
                    defaultValue={dayjs(new Date(endDate))}
                    value={dayjs(new Date(endDate))}
                    onChange={handleEndDateChange}
                    minDateTime={dayjs(startDate)}
                    disabled={!startDate}
                    sx={{ flex: 1 }}

                    slotProps={{
                        textField: {
                            size: 'small'
                        },
                    }}
                />
            </Box>


        </FormControl>
    </LocalizationProvider>
}