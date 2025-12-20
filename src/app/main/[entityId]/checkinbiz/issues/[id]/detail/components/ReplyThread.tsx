import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Chip,
    Paper,
    useTheme,
    CircularProgress
} from '@mui/material';
import useResponseIssueController from '../detail.controller';
import { format_date } from '@/lib/common/Date';
import { useTranslations } from 'next-intl';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import ResponseFormModal from './ResponseFormModal/ResponseFormModal';
import emptyImage from '../../../../../../../../../public/assets/images/empty/asistencia.svg';
import EmptyList from '@/components/common/EmptyState/EmptyList';
import { IIssue } from '@/domain/features/checkinbiz/IIssue';



const statusColors: any = {
    'Aceptada': 'success',
    'Pendiente': 'warning',
    'Rechazada': 'error'
};

const ReplyThread = ({issue}:{issue:IIssue}) => {
    const theme = useTheme();
    const { items, loading, limit, total, loadMore } = useResponseIssueController()
    const t = useTranslations();
    const getStatusColor = (status: any) => {
        return statusColors[status] || 'default';
    };
    const { open, openModal } = useCommonModal()

    return (
        <Box sx={{ maxWidth: '100%', margin: '0 auto', p: 3 }}>
            {/* Contador de respuestas */}
            <Box sx={{ maxWidth: '100%', margin: '0 auto', p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    {t("issues.responses")}: {items.length > 0 ? items[0].totalItems : 0}
                </Typography>
                <SassButton variant='contained' onClick={() => openModal(CommonModalType.FORM)}>{t("issues.response")}</SassButton>
            </Box>

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


            {limit <= total && <SassButton variant='outlined' onClick={() => loadMore()} >{t('core.label.moreload')}</SassButton>}
            {open.type === CommonModalType.FORM && <ResponseFormModal issue={issue} onSuccess={() => loadMore(true)} />}


        </Box>
    );
};

export default ReplyThread;