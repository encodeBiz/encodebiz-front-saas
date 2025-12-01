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
    useMediaQuery,
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
import { getEmplyeeLogs, getIssues } from '@/services/checkinbiz/employee.service';
import { useToast } from '@/hooks/useToast';
import { fetchSucursal, search } from '@/services/checkinbiz/sucursal.service';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import SearchFilter from '@/components/common/table/filters/SearchFilter';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { ISucursal } from '@/domain/features/checkinbiz/ISucursal';
import { IIssue } from '@/domain/features/checkinbiz/IIssue';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { AccessTime, CalendarToday, HomeWork } from '@mui/icons-material';
import { CustomChip } from '@/components/common/table/CustomChip';
const Issues = () => {
    const { sessionData } = useCheck()
    const t = useTranslations()
    const theme = useTheme()
    const [pending, setPending] = useState(false)
    const [issueList, setIssueList] = useState<Array<IIssue>>([])
    const { showToast } = useToast()
    const { open, closeModal } = useCommonModal()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [limit, setLimit] = useState<number>(10)
    const [total, setTotal] = useState(0)
    const [branchList, setBranchList] = useState<Array<ISucursal>>([])
    const [branchSelected, setBranchSelected] = useState<string>('all')

    const handldeIssues = async (branchId: string = 'all', limit: number = 10) => {
        setPending(true)
        try {
            const filters = []
            if (branchId! !== 'all')
                filters.push({ field: 'branchId', operator: '==', value: branchId })

            const resultList: Array<IIssue> = await getIssues(
                sessionData?.entityId as string,
                sessionData?.employeeId as string,
                {
                    limit,
                    orderBy: 'createdAt',
                    orderDirection: 'desc',
                    filters
                } as any
            ) as Array<IIssue>
            if (resultList.length > 0) setTotal((resultList[0] as any).totalItems)

            const data = await Promise.all(
                resultList.map(async (item) => {
                    const branch = (await fetchSucursal(item.entityId, item.branchId))
                    return {
                        ...item,
                        branch
                    };
                })
            );

            setIssueList(data)
            setPending(false)
        } catch (error) {
            setPending(false)
            showToast('Error fetchind logs data: ' + error, 'error')
        }

    }

    const fetchBranch = async () => {
        setBranchList(await search(sessionData?.entityId as string, {
            filters: [{
                field: 'status', operator: '==', value: 'active'
            }], limit: 100
        } as any))
    }

    useEffect(() => {
        if (sessionData?.entityId) {
            handldeIssues(branchSelected)
            fetchBranch()
        }
    }, [sessionData?.entityId])
    const loadMore = () => {
        setLimit(limit + 10)
        handldeIssues(branchSelected, limit + 10)
    }

    return (
        <Dialog
            open={open.open}
            onClose={() => closeModal(CommonModalType.LOGS)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            fullScreen={isMobile}
            maxWidth={'lg'}
            slotProps={{ paper: { sx: { p: 0, borderRadius: 2, width: '100vw', height: '90vh', background: "#F0EFFD" } } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'flex-start', textAlign: 'left', mt: 4 }}>
                    <Typography variant="body1" fontWeight={'bold'} fontSize={18} > {t('checking.issues')} </Typography>
                    {pending && <CircularProgress color="inherit" size={20} />}
                </Box>
                <CustomIconBtn
                    sx={{ position: 'absolute', top: 16, right: 26 }}
                    onClick={() => closeModal(CommonModalType.LOGS)}
                    color={theme.palette.primary.main}
                />
            </DialogTitle>
            <DialogContent  >
                <Box sx={{ p: 2, pt: 4, position: 'relative', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 6 }}>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: {
                            xs: 'column',
                            sm: 'column',
                            md: 'column',
                            lg: 'column',
                            xl: 'column',
                        },
                        gap: 2,
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end'
                    }}>


                        <SearchFilter width='100%'
                            label={t('core.label.sucursal')}
                            value={branchSelected}
                            onChange={(value: any) => {
                                setBranchSelected(value)
                                handldeIssues(value, value)

                            }}
                            options={[...branchList.map(e => ({ value: e.id, label: e.name }))]}
                        />
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: {
                            xs: 'column',
                            sm: 'column',
                            md: 'column',
                            lg: 'column',
                            xl: 'column',
                        },
                        gap: 2,
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end'
                    }}>

                        {issueList.map((row: IIssue, index: number) => (
                            <BorderBox
                                key={index}
                                sx={{ p: 2, width: '100%' }}
                            >
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={1}>
                                            <AccessTime sx={{ color: theme => theme.palette.primary.dark }} />
                                            <Typography sx={{ fontSize: 14, color: theme => theme.palette.primary.dark }} fontWeight={'bold'} color='primary'>{row.comments}</Typography>
                                        </Box>

                                        <CustomChip small background={row.state} label={t('core.label.' + row.state)} />
                                    </Box>

                                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={1}>
                                        <HomeWork sx={{ color: theme => theme.palette.grey[800] }} />
                                        <Typography sx={{ fontSize: 12, color: theme => theme.palette.grey[800] }}>{row.branch?.name}</Typography>
                                    </Box>

                                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={1}>
                                        <CalendarToday sx={{ color: theme => theme.palette.grey[800] }} />
                                        <Typography sx={{ fontSize: 12, color: theme => theme.palette.grey[800] }}>{format_date(row.createdAt)}</Typography>
                                    </Box>
                                </Box>

                            </BorderBox>
                        ))}
                    </Box>
                    <TableContainer component={Paper}>

                        {issueList.length === 0 && !pending && <EmptyState />}
                    </TableContainer>
                    {pending && <Box sx={{ width: '100%', display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <CircularProgress color="inherit" size={20} />
                    </Box>}
                    {limit <= total && <SassButton variant='outlined' onClick={() => loadMore()} >{t('core.label.moreload')}</SassButton>}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default Issues;
