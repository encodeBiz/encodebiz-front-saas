import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Grid,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Paper,
    Stack,
    Alert,
    AlertTitle,
} from '@mui/material';
import {
    AccessTime,
    Schedule,
    Notifications,
    CheckCircle,
    Cancel,
    Today,
    NotificationsOutlined,
    StopCircleOutlined,
    PlayCircleOutline,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ISucursal } from '@/domain/features/checkinbiz/ISucursal';
import { DetailText } from '@/components/common/table/DetailText';
import { useTranslations } from 'next-intl';

// Tipos
interface Time {
    hour: number;
    minute: number;
}

interface DaySchedule {
    enabled: boolean;
    start: Time;
    end: Time;
}

interface WorkSchedule {
    monday?: DaySchedule;
    tuesday?: DaySchedule;
    wednesday?: DaySchedule;
    thursday?: DaySchedule;
    friday?: DaySchedule;
    saturday?: DaySchedule;
    sunday?: DaySchedule;
    notifyBeforeMinutes?: number;
}

interface WorkScheduleDetailProps {
    schedule: WorkSchedule;
    title?: string;
    showEmptyDays?: boolean;
    compact?: boolean;
    notifyBeforeMinutes?: number
    branch: ISucursal
}

// Función para formatear hora
const formatTime = (time: Time): string => {
    const date = new Date();
    date.setHours(time.hour, time.minute, 0, 0);
    return format(date, 'hh:mm a');
};

// Función para calcular duración
const calculateDuration = (start: Time, end: Time): string => {
    const startMinutes = start.hour * 60 + start.minute;
    const endMinutes = end.hour * 60 + end.minute;

    let durationMinutes = endMinutes - startMinutes;

    // Si el horario pasa de medianoche
    if (durationMinutes < 0) {
        durationMinutes += 24 * 60;
    }

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} h`;
    return `${hours}h ${minutes}min`;
};

// Componente para mostrar un día específico
const DayScheduleItem: React.FC<{
    day: string;
    schedule?: DaySchedule;
    compact?: boolean;
}> = ({ day, schedule, compact = false }) => {
    if (!schedule || !schedule.enabled) return null;

    const duration = calculateDuration(schedule.start, schedule.end);

    return (
        <ListItem
            sx={{
                borderRadius: 1,
                mb: compact ? 0.5 : 1,
                bgcolor: 'background.default'
            }}
        >
            <ListItemIcon sx={{ minWidth: 40 }}>
                <AccessTime color="primary" />
            </ListItemIcon>

            <ListItemText
                primary={
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant={compact ? "body2" : "body1"} fontWeight="medium">
                            {day}
                        </Typography>
                        {!compact && (
                            <Chip
                                label={duration}
                                size="small"
                                color="info"
                                variant="outlined"
                            />
                        )}
                    </Box>
                }
                secondary={
                    <Box sx={{ mt: 0.5 }}>
                        <Stack
                            direction={compact ? "row" : { xs: "column", sm: "row" }}
                            spacing={compact ? 1 : { xs: 0.5, sm: 2 }}
                            alignItems={compact ? "center" : "flex-start"}
                        >
                            <Chip
                                icon={<PlayCircleOutline fontSize="small" />}
                                label={`Inicio: ${formatTime(schedule.start)}`}
                                size="small"
                                variant="outlined"
                                color="success"
                                sx={{
                                    borderRadius: 1,
                                    fontSize: compact ? '0.75rem' : '0.8125rem'
                                }}
                            />
                            <Chip
                                icon={<StopCircleOutlined fontSize="small" />}
                                label={`Fin: ${formatTime(schedule.end)}`}
                                size="small"
                                variant="outlined"
                                color="error"
                                sx={{
                                    borderRadius: 1,
                                    fontSize: compact ? '0.75rem' : '0.8125rem'
                                }}
                            />
                            {compact && (
                                <Typography variant="caption" color="text.secondary">
                                    {duration}
                                </Typography>
                            )}
                        </Stack>
                    </Box>
                }
            />
        </ListItem>
    );
};

// Componente principal
const WorkScheduleDetail: React.FC<WorkScheduleDetailProps> = ({
    schedule,
    title = "Horario Laboral",
    showEmptyDays = false,
    compact = false,
    notifyBeforeMinutes = 0,
    branch
}) => {
    // Configuración de días
    const t = useTranslations()
    const daysConfig = [
        { key: 'monday' as const, label: 'Lunes' },
        { key: 'tuesday' as const, label: 'Martes' },
        { key: 'wednesday' as const, label: 'Miércoles' },
        { key: 'thursday' as const, label: 'Jueves' },
        { key: 'friday' as const, label: 'Viernes' },
        { key: 'saturday' as const, label: 'Sábado' },
        { key: 'sunday' as const, label: 'Domingo' },
    ];

    // Filtrar días habilitados
    const enabledDays = daysConfig.filter(
        day => schedule[day.key]?.enabled
    );

    // Contar días habilitados
    const enabledDaysCount = enabledDays.length;

    // Calcular horas totales por semana
    const calculateTotalWeeklyHours = (): string => {
        let totalMinutes = 0;

        daysConfig.forEach(day => {
            const daySchedule = schedule[day.key];
            if (daySchedule?.enabled) {
                const start = daySchedule.start;
                const end = daySchedule.end;
                const startMinutes = start.hour * 60 + start.minute;
                const endMinutes = end.hour * 60 + end.minute;

                let duration = endMinutes - startMinutes;
                if (duration < 0) duration += 24 * 60;

                totalMinutes += duration;
            }
        });

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours === 0) return `${minutes} minutos`;
        if (minutes === 0) return `${hours} horas`;
        return `${hours}h ${minutes}min`;
    };

    // Obtener días deshabilitados para mostrar mensaje
    const disabledDays = daysConfig.filter(
        day => !schedule[day.key]?.enabled
    ).map(day => day.label);

    return (
        <Paper elevation={0} sx={{ p: 3 }}>



            {branch?.advance && <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'flex-start'} gap={4} alignItems={'flex-start'}>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} alignItems={'flex-start'}>
                    <DetailText orientation="row" label={t('core.label.breakTimeRange')} value={branch?.advance?.timeBreak + ' ' + t('core.label.minutes')} />
                    <DetailText help={branch?.advance?.disableBreak ? t('sucursal.disableBreakAlertMessageE') : t('sucursal.disableBreakAlertMessageD')} label={!branch?.advance?.disableBreak ? t('sucursal.breakDisabledText') : t('sucursal.breakEnableText')} />
                </Box>
            </Box>}
            <Box sx={{ mb: compact ? 2 : 3 }}>
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={2}
                >

                    <Box display={'flex'} alignItems={'center'} gap={2}>
                        <DetailText help={branch?.advance?.enableDayTimeRange ? t('sucursal.dayTimeRangeAlertMessageE') : t('sucursal.dayTimeRangeAlertMessageD')} label={branch?.advance?.enableDayTimeRange ? t('sucursal.dayTimeRangeEnableText') : t('sucursal.dayTimeRangeDisabledText')} />

                    </Box>
                </Stack>

            </Box>
            {!branch.advance?.workScheduleEnable && <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} alignItems={'flex-start'}>
                <DetailText orientation="row" label={t('core.label.dayTimeRange')} value={((branch?.advance?.startTimeWorkingDay?.hour as number) < 10 ? '0' + branch?.advance?.startTimeWorkingDay?.hour : branch?.advance?.startTimeWorkingDay?.hour) + ':' + ((branch?.advance?.startTimeWorkingDay?.minute as number) < 10 ? '0' + branch?.advance?.startTimeWorkingDay?.minute : branch?.advance?.startTimeWorkingDay?.minute) + ' - ' + ((branch?.advance?.endTimeWorkingDay?.hour as number) < 10 ? '0' + branch?.advance?.endTimeWorkingDay?.hour : branch?.advance?.endTimeWorkingDay?.hour) + ':' + ((branch?.advance?.endTimeWorkingDay?.minute as number) < 10 ? '0' + branch?.advance?.endTimeWorkingDay?.minute : branch?.advance?.endTimeWorkingDay?.minute)} />
            </Box>}
            {branch.advance?.workScheduleEnable && <>
                {/* Estadísticas rápidas */}
                {!compact && enabledDaysCount > 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 3,
                            bgcolor: 'primary.light',
                            background: theme => theme.palette.secondary.light,
                            borderRadius: 2
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid  >
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <AccessTime color="primary" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Horas semanales
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold">
                                            {calculateTotalWeeklyHours()}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid  >
                                {notifyBeforeMinutes && (
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <NotificationsOutlined color="primary" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Notificar antes
                                            </Typography>
                                            <Typography variant="h6" fontWeight="bold">
                                                {notifyBeforeMinutes} min
                                            </Typography>
                                        </Box>
                                    </Stack>
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                {/* Lista de días habilitados */}
                {enabledDaysCount > 0 ? (
                    <>
                        <Typography
                            variant={compact ? "body2" : "body1"}
                            color="text.secondary"
                            gutterBottom
                            sx={{ mb: compact ? 1 : 2 }}
                        >
                            Días programados ({enabledDaysCount})
                        </Typography>

                        <List sx={{ p: 0 }}>
                            {enabledDays.map((day) => (
                                <DayScheduleItem
                                    key={day.key}
                                    day={day.label}
                                    schedule={schedule[day.key]}
                                    compact={compact}
                                />
                            ))}
                        </List>
                    </>
                ) : (
                    <Alert
                        severity="warning"
                        icon={<Cancel />}
                        sx={{ mb: 2 }}
                    >
                        <AlertTitle>Sin horario configurado</AlertTitle>
                        No hay días habilitados en el horario laboral.
                    </Alert>
                )}


            </>}

        </Paper>
    );
};

export default WorkScheduleDetail;