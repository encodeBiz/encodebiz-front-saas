'use client';

import { useEffect, useMemo, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Chip, Divider, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { AccessTime, AlarmOutlined, ExpandMoreOutlined, NotificationsNoneOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { getRefByPathData } from "@/lib/firebase/firestore/readDocument";
import { WeeklyScheduleWithBreaks, Holiday } from "@/domain/features/checkinbiz/ICalendar";
import WorkScheduleDetail from "./WorkScheduleDetail";
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal";

type BranchCalendarConfig = {
    overridesSchedule?: WeeklyScheduleWithBreaks;
    disabled?: boolean;
    advance?: {
        enableDayTimeRange?: boolean;
        disableBreak?: boolean;
        timeBreak?: number;
        notifyBeforeMinutes?: number;
    };
    holidays?: Holiday[];
};

const mapScheduleWithEnabled = (schedule?: WeeklyScheduleWithBreaks, fallback?: WeeklyScheduleWithBreaks): WeeklyScheduleWithBreaks => {
    const base = fallback ?? {};
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
    const result: WeeklyScheduleWithBreaks = {};
    dayKeys.forEach((key) => {
        const dayValue: any = schedule?.[key];
        if (dayValue) {
            const enabled = dayValue.disabled ? false : dayValue.enabled ?? true;
            result[key] = { ...dayValue, enabled, disabled: dayValue.disabled ?? !enabled };
        } else if ((base as any)[key]) {
            result[key] = { ...(base as any)[key] };
        }
    });
    return result;
};

const BranchCalendarDetail = ({ branch, refreshKey = 0 }: { branch: ISucursal; refreshKey?: number }) => {
    const t = useTranslations('calendar');
    const tSucursal = useTranslations('sucursal');
    const tCore = useTranslations('core.label');
    const tDays = useTranslations('core.days');
    const { currentEntity } = useEntity();
    const { changeLoaderState } = useLayout();
    const entityId = currentEntity?.entity?.id;
    const branchId = branch?.id;

    const [config, setConfig] = useState<BranchCalendarConfig | null>(null);
    const totalWeeklyMinutes = useMemo(() => {
        if (!config?.overridesSchedule) return 0;
        let total = 0;
        const schedule = config.overridesSchedule;
        const breakMinutes = config.advance?.disableBreak && config.advance?.timeBreak ? Number(config.advance.timeBreak) : 0;
        const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
        dayKeys.forEach((key) => {
            const dayValue = (schedule as any)[key];
            if (dayValue?.enabled && dayValue.start && dayValue.end) {
                const duration = (dayValue.end.hour * 60 + dayValue.end.minute) - (dayValue.start.hour * 60 + dayValue.start.minute);
                total += Math.max(0, duration - breakMinutes);
            }
        });
        return total;
    }, [config?.overridesSchedule, config?.advance?.disableBreak, config?.advance?.timeBreak]);

    const totalWeeklyHoursLabel = useMemo(() => {
        const hours = Math.floor(totalWeeklyMinutes / 60);
        const mins = totalWeeklyMinutes % 60;
        if (hours === 0 && mins === 0) return '0h';
        if (mins === 0) return `${hours}h`;
        if (hours === 0) return `${mins}m`;
        return `${hours}h ${mins}m`;
    }, [totalWeeklyMinutes]);
    const [loading, setLoading] = useState(false);

    const fallbackSchedule: WeeklyScheduleWithBreaks = {
        monday: { enabled: true, disabled: false, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
        tuesday: { enabled: true, disabled: false, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
        wednesday: { enabled: true, disabled: false, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
        thursday: { enabled: true, disabled: false, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
        friday: { enabled: true, disabled: false, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
        saturday: { enabled: true, disabled: false, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
        sunday: { enabled: false, disabled: true, start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } },
    };
    const fallbackAdvance = {
        enableDayTimeRange: false,
        disableBreak: false,
        timeBreak: 30,
        notifyBeforeMinutes: 15,
    };

    useEffect(() => {
        const load = async () => {
            if (!entityId || !branchId) return;
            setLoading(true);
            changeLoaderState({ show: true, args: { text: t('actions.saving') } });
            try {
                const entityPath = `entities/${entityId}/calendar/config`;
                const entityData = await getRefByPathData(entityPath);
                const entitySchedule: WeeklyScheduleWithBreaks = entityData?.defaultSchedule
                    ? mapScheduleWithEnabled(entityData.defaultSchedule as WeeklyScheduleWithBreaks, fallbackSchedule)
                    : fallbackSchedule;
                const entityAdvance = entityData?.advance ?? fallbackAdvance;

                const path = `entities/${entityId}/branches/${branchId}/calendar/config`;
                const data = await getRefByPathData(path);
                if (data) {
                    setConfig({
                        overridesSchedule: mapScheduleWithEnabled(data.overridesSchedule as WeeklyScheduleWithBreaks | undefined, entitySchedule),
                        disabled: data.disabled ?? false,
                        advance: data.advance ?? entityAdvance,
                        holidays: Array.isArray(data.holidays) ? data.holidays : data.holiday ? [data.holiday] : [],
                    });
                } else {
                    setConfig({
                        overridesSchedule: entitySchedule,
                        disabled: true,
                        advance: entityAdvance,
                        holidays: [],
                    });
                }
            } catch (error) {
                setConfig({
                    overridesSchedule: fallbackSchedule,
                    disabled: true,
                    advance: fallbackAdvance,
                    holidays: [],
                });
            } finally {
                setLoading(false);
                changeLoaderState({ show: false });
            }
        };
        load();
    }, [entityId, branchId, changeLoaderState, t, refreshKey]);

    const schedule = config?.overridesSchedule ?? fallbackSchedule;
    const disabled = config?.disabled;

    return (
        <Stack spacing={3}>
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                    <Stack>
                        <Typography fontWeight={600}>{t('schedule.title')}</Typography>
                        <Typography color="text.secondary" variant="body2">{t('schedule.subtitle')}</Typography>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <Chip
                            color={disabled ? "default" : "primary"}
                            variant="outlined"
                            label={disabled ? t('notes.inheritance') : t('schedule.title')}
                            size="small"
                        />
                    </Stack>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        {t('notes.inheritance')}
                    </Alert>

                    {!loading && (
                        <Stack spacing={3}>
                            {config?.advance?.disableBreak && (
                                <Box sx={{ bgcolor: 'rgb(221, 226, 247)', borderRadius: 2, p: 2 }}>
                                    <Typography variant="subtitle2" fontWeight={700}>{tSucursal('breakTime')}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {tSucursal('breakEnableText')}
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <AccessTime color="primary" fontSize="small" />
                                        <Typography variant="h6" fontWeight={700}>
                                            {config?.advance?.timeBreak ?? 0} {tCore('minute')}
                                        </Typography>
                                    </Stack>
                                </Box>
                            )}

                            <Box sx={{ bgcolor: 'rgb(221, 226, 247)', borderRadius: 2, p: 2 }}>
                                <Typography variant="subtitle2" fontWeight={700}>{t('schedule.title')}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {config?.advance?.enableDayTimeRange ? t('schedule.strictRange') : t('schedule.flexInfo.line1')}
                                </Typography>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="flex-start">
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <AccessTime color="primary" fontSize="small" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">{tSucursal('weekTime')}</Typography>
                                            <Typography variant="h6" fontWeight={700}>{totalWeeklyHoursLabel}</Typography>
                                        </Box>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <NotificationsNoneOutlined color="primary" fontSize="small" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">{tCore('adviseWorkDay')}</Typography>
                                            <Typography variant="h6" fontWeight={700}>{config?.advance?.notifyBeforeMinutes ?? 0} {tCore('minute')}</Typography>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Box>

                            <Box>
                                <Typography fontWeight={700} sx={{ mb: 1 }}>
                                    {tSucursal('scheduledDays')} ({Object.values(schedule || {}).filter((d: any) => d?.enabled).length})
                                </Typography>
                                <Stack spacing={1.5}>
                                    {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const)
                                        .map((dayKey) => {
                                            const dayValue: any = (schedule as any)[dayKey];
                                            if (!dayValue?.enabled) return null;
                                            const durationMinutes = (dayValue.end.hour * 60 + dayValue.end.minute) - (dayValue.start.hour * 60 + dayValue.start.minute);
                                            const breakMinutes = config?.advance?.disableBreak && config?.advance?.timeBreak ? Number(config.advance.timeBreak) : 0;
                                            const netMinutes = Math.max(0, durationMinutes - breakMinutes);
                                            const hours = Math.floor(netMinutes / 60);
                                            const mins = netMinutes % 60;
                                            const durationLabel = `${hours > 0 ? `${hours}h ` : ''}${mins > 0 ? `${mins}m` : ''}`.trim() || '0m';

                                            return (
                                                <Box key={dayKey} sx={{ bgcolor: 'rgb(221, 226, 247)', borderRadius: 2, p: 2, border: '1px solid', borderColor: '#d0d7f2' }}>
                                                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
                                                        <Typography fontWeight={600}>{tDays(dayKey as any)}</Typography>
                                                        <Chip label={durationLabel} color="primary" variant="outlined" size="small" />
                                                    </Stack>
                                                    <Stack direction="row" spacing={2} mt={1} alignItems="center" flexWrap="wrap">
                                                        <Chip
                                                            icon={<AlarmOutlined color="success" fontSize="small" />}
                                                            label={`${tCore('startTime')}: ${String(dayValue.start.hour).padStart(2, '0')}:${String(dayValue.start.minute).padStart(2, '0')}`}
                                                            variant="outlined"
                                                            color="success"
                                                            size="small"
                                                        />
                                                        <Chip
                                                            icon={<AlarmOutlined color="error" fontSize="small" />}
                                                            label={`${tCore('endTime')}: ${String(dayValue.end.hour).padStart(2, '0')}:${String(dayValue.end.minute).padStart(2, '0')}`}
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                        />
                                                    </Stack>
                                                </Box>
                                            );
                                        })}
                                </Stack>
                            </Box>
                        </Stack>
                    )}

                    <Divider sx={{ my: 2 }} />
                    <Stack spacing={1}>
                        <Typography variant="body2">{t('notes.inheritance')}</Typography>
                        <Typography variant="body2">{t('notes.inactiveDays')}</Typography>
                        <Typography variant="body2">{t('notes.toleranceHint')}</Typography>
                    </Stack>
                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                    <Stack>
                        <Typography fontWeight={600}>{t('holidays.title')}</Typography>
                        <Typography color="text.secondary" variant="body2">{t('holidays.subtitle')}</Typography>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('holidays.columns.name')}</TableCell>
                                <TableCell>{t('holidays.columns.date')}</TableCell>
                                <TableCell>{t('holidays.columns.description')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(config?.holidays ?? []).length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <Typography color="text.secondary">{t('holidays.empty')}</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                            {(config?.holidays ?? []).map((holiday) => (
                                <TableRow key={holiday.id}>
                                    <TableCell>{holiday.name}</TableCell>
                                    <TableCell>{holiday.date}</TableCell>
                                    <TableCell>{holiday.description || '--'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </AccordionDetails>
            </Accordion>
        </Stack>
    );
};

export default BranchCalendarDetail;
