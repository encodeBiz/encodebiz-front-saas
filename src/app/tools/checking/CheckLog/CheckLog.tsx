/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
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
import { useCheck } from '../page.controller';
import { DateRangePicker } from '@/app/main/[entityId]/passinbiz/stats/components/filters/fields/DateRangeFilter';
import { CustomIconBtn } from '@/components/icons/CustomIconBtn';
import EmptyState from '@/components/common/EmptyState/EmptyState';
const CheckLog = () => {
    const { setOpenLogs } = useCheck()
    const t = useTranslations()
    const rows: Array<any> = []
    const [range, setRange] = useState<{ start: any, end: any }>({ start: new Date(), end: new Date() })
    const theme = useTheme()
    return (
        <Box sx={{ p: 2, pt: 4, position: 'relative', maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Typography variant="body1" fontWeight={'bold'} fontSize={22} > {t('checking.title')} </Typography>
            <CustomIconBtn
                sx={{ position: 'absolute', top: 16, right: 16 }}
                onClick={() => setOpenLogs(false)}
                color={theme.palette.primary.main}
            />
            <DateRangePicker width='100%' value={range} onChange={setRange} />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Sucursal</TableCell>
                            <TableCell align="right">Registro</TableCell>
                            <TableCell align="right">Fecha</TableCell>
                            <TableCell align="right">Hora</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                       
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.calories}</TableCell>
                                <TableCell align="right">{row.fat}</TableCell>
                                <TableCell align="right">{row.carbs}</TableCell>
                                <TableCell align="right">{row.protein}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {rows.length === 0 && <EmptyState/>}
            </TableContainer>



        </Box>
    );
};

export default CheckLog;