
import React from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme
    ,

} from '@mui/material';

import { useTranslations } from 'next-intl';

import { DateRangePicker } from '@/app/main/[entityId]/passinbiz/stats/components/filters/fields/DateRangeFilter';
import { CustomIconBtn } from '@/components/icons/CustomIconBtn';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import { IChecklog } from '@/domain/features/checkinbiz/IChecklog';
import { format_date } from '@/lib/common/Date';
import { useCheck } from '../page.context';
const CheckLog = () => {
    const { setOpenLogs, employeeLogs, range,   getEmplyeeLogsData } = useCheck()
    const t = useTranslations()
    const theme = useTheme()


    return (
        <Box sx={{ p: 2, pt: 4, position: 'relative', maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Typography variant="body1" fontWeight={'bold'} fontSize={22} > {t('checking.title')} </Typography>
            <CustomIconBtn
                sx={{ position: 'absolute', top: 16, right: 16 }}
                onClick={() => setOpenLogs(false)}
                color={theme.palette.primary.main}
            />
            <DateRangePicker width='100%' value={range} onChange={(rg: { start: any, end: any }) => {
                getEmplyeeLogsData(rg   )
               // setRange(rg)
            }} />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("core.label.branch")}</TableCell>
                            <TableCell align="right">{t("core.label.register")}</TableCell>
                            <TableCell align="right">{t("core.label.hora")}</TableCell>
                            <TableCell align="right">{t("core.label.time")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {employeeLogs.map(async (row: IChecklog, index: number) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >

                                <TableCell align="right">{row.branchId}</TableCell>
                                <TableCell align="right">{t('core.label.' + row.type)}</TableCell>
                                <TableCell align="right">{format_date(row.timestamp, 'DD/MM/YYYY')}</TableCell>
                                <TableCell align="right">{format_date(row.timestamp, 'hh:mm')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {employeeLogs.length === 0 && <EmptyState />}
            </TableContainer>



        </Box>
    );
};

export default CheckLog;