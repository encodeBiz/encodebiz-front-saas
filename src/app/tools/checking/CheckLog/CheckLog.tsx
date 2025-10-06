/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import {
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
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
import { format_date, rmNDay } from '@/lib/common/Date';
import { useCheck } from '../page.context';
import { getEmplyeeLogs } from '@/services/checkinbiz/employee.service';
import { useToast } from '@/hooks/useToast';
import { fetchSucursal } from '@/services/checkinbiz/sucursal.service';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
const CheckLog = () => {
    const { sessionData } = useCheck()
    const t = useTranslations()
    const theme = useTheme()
    const [pending, setPending] = useState(false)
    const [range, setRange] = useState<{ start: any, end: any }>({ start: rmNDay(new Date(), 1), end: new Date() })
    const [employeeLogs, setEmployeeLogs] = useState<Array<IChecklog>>([])
    const { showToast } = useToast()
    const { open, closeModal } = useCommonModal()

    const getEmplyeeLogsData = async (range: { start: any, end: any }) => {
        setPending(true)
        try {
            const filters = [
                { field: 'timestamp', operator: '>=', value: new Date(range.start) },
                { field: 'timestamp', operator: '<=', value: new Date(range.end) },
            ]
            const resultList: Array<IChecklog> = await getEmplyeeLogs(sessionData?.entityId || '', sessionData?.employeeId || '', sessionData?.branchId || '', { limit: 50, orderBy: 'timestamp', orderDirection: 'desc', filters } as any) as Array<IChecklog>
            const data = await Promise.all(
                resultList.map(async (item) => {
                    const branchId = (await fetchSucursal(item.entityId, item.branchId))?.name
                    return {
                        ...item,
                        branchId
                    };
                })
            );

            setEmployeeLogs(data)
            setPending(false)
        } catch (error) {
            setPending(false)
            showToast('Error fetchind logs data: ' + error, 'error')
        }

    }

    useEffect(() => {
        if (sessionData?.entityId)
            getEmplyeeLogsData(range)
    }, [sessionData?.entityId])


    return (
        <Dialog
            open={open.open}
            onClose={() => closeModal(CommonModalType.LOGS)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="lg"
            fullScreen
            slotProps={{ paper: { sx: { p: 0, borderRadius: 2, width: '100%' } } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                    <Typography variant="body1" fontWeight={'bold'} fontSize={22} > {t('checking.title')} </Typography>
                    {pending && <CircularProgress color="inherit" size={20} />}                </Box>
                <CustomIconBtn
                    sx={{ position: 'absolute', top: 16, right: 16 }}
                    onClick={() => closeModal(CommonModalType.LOGS)}
                    color={theme.palette.primary.main}
                />
            </DialogTitle>
            <DialogContent  >
                <Box sx={{ p: 2, pt: 4, position: 'relative', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 6 }}>

                    <DateRangePicker width='100%' value={range} onChange={(rg: { start: any, end: any }) => {
                        getEmplyeeLogsData(rg)
                        setRange(rg)
                    }} />
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">{t("core.label.branch")}</TableCell>
                                    <TableCell align="left">{t("core.label.register")}</TableCell>
                                    <TableCell align="left">{t("core.label.date")}</TableCell>
                                    <TableCell align="left">{t("core.label.time")}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {employeeLogs.map((row: IChecklog, index: number) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >

                                        <TableCell align="left">{row.branchId}</TableCell>
                                        <TableCell align="left">{t('core.label.' + row.type)}</TableCell>
                                        <TableCell align="left">{format_date(row.timestamp, 'DD/MM/YYYY')}</TableCell>
                                        <TableCell align="left">{format_date(row.timestamp, 'hh:mm')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {employeeLogs.length === 0 && <EmptyState />}
                    </TableContainer>



                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default CheckLog;


 