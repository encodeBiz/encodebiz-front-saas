/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Paper,
    TableContainer,
    Typography,
    useMediaQuery,
    useTheme
    ,

} from '@mui/material';

import { useTranslations } from 'next-intl';

import { CustomIconBtn } from '@/components/icons/CustomIconBtn';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import { format_date } from '@/lib/common/Date';
import { useCheck } from '../page.context';
import { fetchEmployee, getIssuesResponsesLists } from '@/services/checkinbiz/employee.service';
import { useToast } from '@/hooks/useToast';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { IIssue, IResponse } from '@/domain/features/checkinbiz/IIssue';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { CardIssue } from '../Issues/CardIssue';
import { IEmployee } from '@/domain/features/checkinbiz/IEmployee';
const IssuesResponse = () => {
    const { sessionData, issueList } = useCheck()
    const t = useTranslations()
    const theme = useTheme()
    const [pending, setPending] = useState(false)
    const [issueIResponseList, setIssuecList] = useState<Array<IResponse>>([])
    const { showToast } = useToast()
    const { open, openModal } = useCommonModal()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [limit, setLimit] = useState<number>(10)
    const [total, setTotal] = useState(0)

    const handldeIssuesResponse = async (limit: number = 10) => {
        setPending(true)
        try {
            const filters: any = []

            const resultList: Array<IResponse> = await getIssuesResponsesLists(
                open.args.issueId as string,
                {
                    limit,
                    orderBy: 'createdAt',
                    orderDirection: 'desc',
                    filters
                } as any
            ) as Array<IResponse>
            if (resultList.length > 0) setTotal((resultList[0] as any).totalItems)



            const data = await Promise.all(
                resultList.map(async (item) => {
                    const employee = (await fetchEmployee(sessionData?.entityId as string, item.employeeId))
                    return {
                        ...item,
                        employee
                    };
                })
            );
            setIssuecList(data)
            setPending(false)
        } catch (error) {
            setPending(false)
            showToast('Error fetchind logs data: ' + error, 'error')
        }

    }

    const [employee, setEmployee] = useState<IEmployee | null>()
    const fetchEmployeeData = async () => {
        const emp = await fetchEmployee(sessionData?.entityId as string, (issueList.find(e => e.id === open.args.issueId as string) as IIssue).employeeId)
        setEmployee(emp)
    }

    useEffect(() => {
        if (sessionData?.entityId) {
            handldeIssuesResponse()
            fetchEmployeeData()
        }
    }, [sessionData?.entityId])
    const loadMore = () => {
        setLimit(limit + 10)
        handldeIssuesResponse(limit + 10)
    }

    return (
        <Dialog
            open={open.open}
            onClose={() => {
                openModal(CommonModalType.ISSUES)
            }}
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
                    onClick={() => {
                        openModal(CommonModalType.ISSUES)
                    }}
                    color={theme.palette.primary.main}
                />
            </DialogTitle>
            <DialogContent  >
                <Box sx={{ pt: 4, position: 'relative', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <CardIssue row={issueList.find(e => e.id === open.args.issueId as string) as IIssue} />
                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={1} p={1}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: (theme => theme.palette.primary.dark) }} >{employee?.fullName?.charAt(0)}</Avatar>
                        <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} justifyContent={'flex-start'}>
                            <Typography sx={{ fontSize: 12, color: theme => theme.palette.primary.dark }} fontWeight={'bold'}  >{employee?.fullName}</Typography>
                            <Typography textTransform={'initial'} sx={{ fontSize: 11, color: theme => theme.palette.text.secondary }}  >{format_date( (issueList.find(e => e.id === open.args.issueId as string) as IIssue).createdAt)}</Typography>
                        </Box>
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
                        gap: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end'
                    }}>

                        {issueIResponseList.map((row: IResponse, index: number) => (
                            <BorderBox
                                key={index}
                                sx={{ p: 2, width: '100%', bgcolor: '#FFFFFF' }}
                            >
                                <Box display={'flex'} flexDirection={'column'} gap={2}>
                                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                                        <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={1}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: (theme => theme.palette.primary.dark) }} >{row?.employee?.fullName?.charAt(0)}</Avatar>
                                            <Typography sx={{ fontSize: 12, color: theme => theme.palette.primary.dark }} fontWeight={'bold'} color='primary'>{row.employee?.fullName}</Typography>
                                        </Box>

                                        <Typography sx={{ fontSize: 12, color: theme => theme.palette.grey[800] }}>{format_date(row.createdAt, 'DD/MM/YYYY hh:mm')}</Typography>
                                    </Box>

                                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={1}>
                                        <Typography sx={{ fontSize: 12 }}>{row.message}</Typography>
                                    </Box>

                                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={1}>
                                        <Typography sx={{ fontSize: 10, color: theme => theme.palette.grey[800] }}>{row.oldState} {' -> '} {row.newState}</Typography>
                                    </Box>
                                </Box>

                            </BorderBox>
                        ))}
                    </Box>
                    {issueIResponseList.length === 0 && !pending && <TableContainer component={Paper}>
                        <EmptyState />
                    </TableContainer>}
                    {pending && <Box sx={{ width: '100%', display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <CircularProgress color="inherit" size={20} />
                    </Box>}
                    {limit <= total && <SassButton variant='outlined' onClick={() => loadMore()} >{t('core.label.moreload')}</SassButton>}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default IssuesResponse;
