/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Chip,
    Paper,
    useTheme,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import { format_date } from '@/lib/common/Date';
import { useTranslations } from 'next-intl';
import { SassButton } from '@/components/common/buttons/GenericButton';
import emptyImage from '../../../../../../public/assets/images/empty/asistencia.svg';
import EmptyList from '@/components/common/EmptyState/EmptyList';
import { IIssue, IIssueResponse } from '@/domain/features/checkinbiz/IIssue';
import { useCheck } from '../../page.context';
import { getIssuesResponsesLists } from '@/services/checkinbiz/employee.service';
import { fetchUser } from '@/services/core/users.service';
import { fetchEmployee as fetchEmployeeData } from "@/services/checkinbiz/employee.service";
import { useToast } from '@/hooks/useToast';
import { CustomTypography } from '@/components/common/Text/CustomTypography';


const statusColors: any = {
    'Aceptada': 'success',
    'Pendiente': 'warning',
    'Rechazada': 'error'
};


const ReplyThread = ({ issue, handleClose, open }: { issue: IIssue, handleClose: () => void, open: boolean }) => {
    const theme = useTheme();
    const t = useTranslations();
    const { sessionData } = useCheck()
    const { showToast } = useToast()


    const [loading, setLoading] = useState<boolean>(true);
    const [items, setItems] = useState<IIssueResponse[]>([]);
    const [limit, setLimit] = useState(10)
    const [total, setTotal] = useState(0)

    const getStatusColor = (status: any) => {
        return statusColors[status] || 'default';
    };

    const fetchingData = (limit: number) => {

        setLoading(true)
        getIssuesResponsesLists(issue?.id as string, { limit } as any).then(async data => {
            const res: Array<IIssueResponse> = await Promise.all(
                data.map(async (item) => {
                    const employee = (await fetchEmployeeData(sessionData?.entityId as string, item.employeeId as string))
                    const user = (await fetchUser(item.userId as string))
                    return { ...item, employee, user };
                })
            );

            setItems(res)
            if (res.length > 0) setTotal(res[0].totalItems ?? 0)

        }).catch(e => {
            showToast(e?.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }


    useEffect(() => {
        if (sessionData?.entityId)
            fetchingData(100)
    }, [sessionData?.entityId])


    return (

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="xl"
            slotProps={{ paper: { sx: { borderRadius: 2 } } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                    {t("issues.responses")}: {items.length > 0 ? items[0].totalItems : 0}
                </Box>
            </DialogTitle>
            <DialogContent >
                <Box sx={{ maxWidth: '100%', margin: '0 auto' }}>


                    {/* Lista de respuestas */}
                    <Box sx={{ mb: 4 }}>
                        {items.map((reply) => (
                            <React.Fragment key={reply.id}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 3,
                                        mb: 2,
                                        borderLeft: (theme) => `4px solid ${theme.palette.primary.main}`,
                                        position: 'relative'
                                    }}
                                >
                                    {/* Cabecera de respuesta */}
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                        <Box display="flex" alignItems="center">
                                            <Avatar sx={{ bgcolor: theme.palette.primary.dark, mr: 2 }}>
                                                {reply.user?.fullName?.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="medium">
                                                    {reply.user?.fullName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {format_date(reply?.createdAt)}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Chip
                                                label={t('core.label.' + reply.oldState) + ' -> ' + t('core.label.' + reply.newState)}
                                                size="small"
                                                color={getStatusColor('Aceptada')}
                                                variant="outlined"
                                            />

                                        </Box>
                                    </Box>

                                    {/* Mensaje */}
                                    <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                                        {reply.message}
                                    </Typography>
                                </Paper>

                            </React.Fragment>
                        ))}
                    </Box>
                    {loading && <Box sx={{ width: '100%', display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <CircularProgress color="inherit" size={20} />
                    </Box>}

                    {items.length === 0 && !loading &&
                        <EmptyList
                            imageUrl={emptyImage}
                            title={t('issues.responseNoDataTitle')}
                            description={t('issues.responseNoDataText')}
                        />}


                    {limit <= total && <SassButton variant='outlined' onClick={() => fetchingData(10)} >{t('core.label.moreload')}</SassButton>}



                </Box>
            </DialogContent>
            <DialogActions >
               <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'100%'} pb={2}>
                 <SassButton
                    color="primary"
                    variant="contained"
                    onClick={(e) => handleClose()}
                    size='small'
                >
                    {t('core.button.close')}
                </SassButton>

               </Box>
            </DialogActions>
        </Dialog >
    );
};

export default ReplyThread;