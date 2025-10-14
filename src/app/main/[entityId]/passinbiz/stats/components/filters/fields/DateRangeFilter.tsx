import { FormControl, Typography } from "@mui/material";
import { useState } from "react"; import {
    Box
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useTranslations } from "next-intl";



export const DateRangePicker = ({
    value = { start: null, end: null },
    onChange,
    width = '450px',
    filter = false
}: {
    value: { start: any, end: any },
    onChange: (value: { start: any, end: any }) => void,
    width?: string
    filter?: boolean


}) => {

    const [startDate, setStartDate] = useState(value?.start);
    const [endDate, setEndDate] = useState(value?.end);
    const t = useTranslations()
    const handleStartDateChange = (newDate: any) => {
        const updatedStartDate = newDate;
        setStartDate(updatedStartDate);
        
        
        // Ensure end date is not before start date
        if (endDate && updatedStartDate && updatedStartDate.isAfter(endDate)) {
            setEndDate(null);
            const selectedStart = new Date(updatedStartDate?.toDate().getFullYear(), updatedStartDate?.toDate().getMonth(), updatedStartDate?.toDate().getDate(), 0, 1)
            onChange?.({ start: selectedStart, end: null });
        } else {
            const selectedEnd = new Date(endDate?.getFullYear(), endDate?.getMonth(), endDate?.getDate(), 23, 59, 59, 999)
            const selectedStart = new Date(updatedStartDate?.toDate().getFullYear(), updatedStartDate?.toDate().getMonth(), updatedStartDate?.toDate().getDate(), 0, 1)

            onChange?.({ start: selectedStart, end: selectedEnd });
        }
    };

    const handleEndDateChange = (newDate: any) => {
        const updatedEndDate = newDate;
        const selectedStart = new Date(startDate?.toDate().getFullYear(), startDate?.toDate().getMonth(), startDate?.toDate().getDate(), 0, 1)
        const selectedEnd = new Date(updatedEndDate?.toDate().getFullYear(), updatedEndDate?.toDate().getMonth(), updatedEndDate?.toDate().getDate(), 23, 59, 59, 999)

        setEndDate(updatedEndDate);
        onChange?.({ start: selectedStart, end: selectedEnd });
    };

    function getDateRange(rangeType: 'today' | 'week' | 'month' | 'year') {
        const now = new Date();
        const result: any = { label: rangeType };

        switch (rangeType) {
            case 'today':
                result.start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                result.end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
                break;

            case 'week':
                const day = now.getDay();
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
                startOfWeek.setHours(0, 0, 0, 0);

                result.start = startOfWeek;
                result.end = new Date(startOfWeek);
                result.end.setDate(startOfWeek.getDate() + 6);
                result.end.setHours(23, 59, 59, 999);
                break;

            case 'month':
                result.start = new Date(now.getFullYear(), now.getMonth(), 1);
                result.end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                break;

            case 'year':
                result.start = new Date(now.getFullYear(), 0, 1);
                result.end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
                break;

            default:
                throw new Error('Invalid range type');
        }

        if (result.start)
            setStartDate(result.start)

        if (result.end)
            setEndDate(result.end)

        return result;
    }

    const [filterRange, setFilterRange] = useState('')
    return <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box display={'flex'} flexDirection={'column'} gap={0} >
            <FormControl sx={{ width: width, mb: 0 }}>

                <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                    <DatePicker
                        label={'Inicio'}

                        defaultValue={dayjs(startDate ?? new Date())}
                        value={dayjs(startDate ?? new Date())}
                        onChange={handleStartDateChange}
                        maxDate={dayjs(endDate) || undefined}
                        sx={{ flex: 1, height: 46 }}

                        slotProps={{
                            textField: {
                                size: 'small',

                            },
                        }}
                    />

                    <DatePicker
                        label={'Fin'}
                        defaultValue={dayjs(new Date(endDate))}
                        value={dayjs(new Date(endDate))}
                        onChange={handleEndDateChange}
                        minDate={dayjs(startDate)}
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
            {filter && <Box display={'flex'} flexDirection={'row'} gap={1} >
                <Typography sx={{ "&:hover": { background: '#E9E8F5' }, cursor: 'pointer', px: 2, py: 0.3, borderRadius: 4, ...(filterRange === 'today' ? { background: '#476ae73f', color: '#476BE7' } : {}) }} variant="caption" onClick={() => {
                    onChange?.({ start: getDateRange('today')?.start, end: getDateRange('today')?.end })
                    setFilterRange('today')
                }} >{t('core.label.today')}</Typography>
                <Typography sx={{ "&:hover": { background: '#E9E8F5' }, cursor: 'pointer', px: 2, py: 0.3, borderRadius: 4, ...(filterRange === 'week' ? { background: '#476ae73f', color: '#476BE7' } : {}) }} variant="caption" onClick={() => {
                    onChange?.({ start: getDateRange('week')?.start, end: getDateRange('week')?.end })
                    setFilterRange('week')
                }} >{t('core.label.thisWeek')}</Typography>
                <Typography sx={{ "&:hover": { background: '#E9E8F5' }, cursor: 'pointer', px: 2, py: 0.3, borderRadius: 4, ...(filterRange === 'month' ? { background: '#476ae73f', color: '#476BE7' } : {}) }} variant="caption" onClick={() => {
                    onChange?.({ start: getDateRange('month')?.start, end: getDateRange('month')?.end })
                    setFilterRange('month')
                }} >{t('core.label.thisMonth')}</Typography>
                <Typography sx={{ "&:hover": { background: '#E9E8F5' }, cursor: 'pointer', px: 2, py: 0.3, borderRadius: 4, ...(filterRange === 'year' ? { background: '#476ae73f', color: '#476BE7' } : {}) }} variant="caption" onClick={() => {
                    onChange?.({ start: getDateRange('year')?.start, end: getDateRange('year')?.end })
                    setFilterRange('year')
                }} >{t('core.label.thisYear')}</Typography>
            </Box>}
        </Box>
    </LocalizationProvider>
}