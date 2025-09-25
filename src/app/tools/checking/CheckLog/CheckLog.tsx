/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
    Box,
    CardContent,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
    ,

} from '@mui/material';

import {

    CheckCircle,
    PlayCircleOutline,
    StopCircleOutlined
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useCommonModal } from '@/hooks/useCommonModal';
import Image from 'next/image';
import { SassButton } from '@/components/common/buttons/GenericButton';
import image from '../../../../../public/assets/images/checkex.png'
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { karla } from '@/config/fonts/google_fonts';
import { useCheck } from '../page.controller';
import { DateRangePicker } from '@/app/main/[entityId]/passinbiz/stats/components/filters/fields/DateRangeFilter';
const CheckLog = () => {
    const {   } = useCheck()
    const t = useTranslations()
    const rows: Array<any> = []
    const [range, setRange] = useState<{start: any, end: any}>({start: new Date(), end: new Date()})

    return (
        <Box sx={{ p: 2, maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 6 }}>

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
            </TableContainer>



        </Box>
    );
};

export default CheckLog;