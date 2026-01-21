'use client';

import { useEffect, useMemo, useState, useCallback } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Divider, FormControlLabel, IconButton, MenuItem, Select, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { ExpandMoreOutlined, AddOutlined, EditOutlined, DeleteOutline } from "@mui/icons-material";
import { Formik, Form } from "formik";
import { useTranslations } from "next-intl";
import { SassButton } from "@/components/common/buttons/GenericButton";
import HolidayModal from "./HolidayModal";
import WorkScheduleField from "@/components/common/forms/fields/WorkScheduleField";
import { DayScheduleWithBreaks, Holiday, WeeklyScheduleWithBreaks } from "@/domain/features/checkinbiz/ICalendar";
import { useEntity } from "@/hooks/useEntity";
import { useAuth } from "@/hooks/useAuth";
import { useLayout } from "@/hooks/useLayout";
import { useToast } from "@/hooks/useToast";
import { useAppLocale } from "@/hooks/useAppLocale";
import { upsertCalendar, deleteCalendarItem } from "@/services/checkinbiz/calendar.service";
import { getRefByPathData } from "@/lib/firebase/firestore/readDocument";
import { search as searchBranch } from "@/services/checkinbiz/sucursal.service";

type BranchCalendarFormValues = {
    branchId: string;
    overridesSchedule: WeeklyScheduleWithBreaks;
    enableDayTimeRange: boolean;
    notifyBeforeMinutes?: number;
    disableBreak?: boolean;
    timeBreak?: number;
    disabled?: boolean;
};

const DAY_ITEMS = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
] as const;

const minutesOf = (time?: { hour?: number; minute?: number }) => (time?.hour ?? 0) * 60 + (time?.minute ?? 0);

const defaultDay = (enabled = true): DayScheduleWithBreaks => ({
    enabled,
    start: { hour: 9, minute: 0 },
    end: { hour: 17, minute: 0 },
});

const buildDefaultSchedule = (): WeeklyScheduleWithBreaks => ({
    monday: defaultDay(true),
    tuesday: defaultDay(true),
    wednesday: defaultDay(true),
    thursday: defaultDay(true),
    friday: defaultDay(true),
    saturday: defaultDay(false),
    sunday: { ...defaultDay(false) },
});

const sanitizeSchedule = (schedule: WeeklyScheduleWithBreaks, enableDayTimeRange: boolean): WeeklyScheduleWithBreaks => {
    const cleaned: WeeklyScheduleWithBreaks = {};
    DAY_ITEMS.forEach(day => {
        const dayValue = schedule[day.key];
        if (dayValue?.enabled && dayValue.start && dayValue.end && minutesOf(dayValue.start) < minutesOf(dayValue.end)) {
            cleaned[day.key] = {
                start: dayValue.start,
                end: dayValue.end,
                strictRange: enableDayTimeRange || dayValue.strictRange ? true : undefined,
                toleranceMinutes: undefined,
            };
        }
    });
    return cleaned;
};

const BranchCalendarTab = () => {
    const t = useTranslations('calendar');
    const tCore = useTranslations('core.label');
    const tSucursal = useTranslations('sucursal');
    const { currentEntity } = useEntity();
    const { token } = useAuth();
    const { changeLoaderState } = useLayout();
    const { showToast } = useToast();
    const { currentLocale } = useAppLocale();

    const defaultValues: BranchCalendarFormValues = useMemo(() => ({
        branchId: '',
        overridesSchedule: buildDefaultSchedule(),
        enableDayTimeRange: false,
        notifyBeforeMinutes: 15,
        disableBreak: false,
        timeBreak: 60,
        disabled: false,
    }), []);

    const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
    const [initialValues, setInitialValues] = useState<BranchCalendarFormValues>(defaultValues);
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [openHolidayModal, setOpenHolidayModal] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState<Holiday | undefined>();
    const [scheduleErrors, setScheduleErrors] = useState<string[]>([]);

    useEffect(() => {
        const loadBranches = async () => {
            if (!currentEntity?.entity?.id) return;
            try {
                const list = await searchBranch(currentEntity.entity.id, { limit: 200 } as any);
                setBranches(list.map((b: any) => ({ id: b.id, name: b.name })));
            } catch (error) {
                setBranches([]);
            }
        };
        loadBranches();
    }, [currentEntity?.entity?.id]);

    const loadBranchCalendar = useCallback(async (branchId: string) => {
        if (!currentEntity?.entity?.id || !branchId) return;
        try {
            changeLoaderState({ show: true, args: { text: t('actions.saving') } });
            const path = `entities/${currentEntity.entity.id}/branches/${branchId}/calendar/config`;
            const data = await getRefByPathData(path);
            if (data) {
                const storedSchedule: WeeklyScheduleWithBreaks = {};
                DAY_ITEMS.forEach(day => {
                    const dayValue = data?.overridesSchedule?.[day.key];
                    if (dayValue) {
                        storedSchedule[day.key] = {
                            ...dayValue,
                            enabled: true,
                        };
                    } else {
                        storedSchedule[day.key] = { ...defaultDay(false) };
                    }
                });

                const advance = data.advance ?? {};

                setInitialValues({
                    branchId,
                    overridesSchedule: storedSchedule,
                    enableDayTimeRange: advance.enableDayTimeRange ?? data.strictRange ?? false,
                    notifyBeforeMinutes: advance.notifyBeforeMinutes ?? data.notifyBeforeMinutes ?? 15,
                    disableBreak: advance.disableBreak ?? data.disableBreak ?? false,
                    timeBreak: advance.timeBreak ?? data.timeBreak ?? 60,
                    disabled: data.disabled ?? false,
                });

                if (Array.isArray(data.holidays)) {
                    setHolidays(data.holidays);
                } else if (data.holiday) {
                    setHolidays([data.holiday]);
                } else {
                    setHolidays([]);
                }
            } else {
                setInitialValues({ ...defaultValues, branchId });
                setHolidays([]);
            }
        } catch (error) {
            setInitialValues({ ...defaultValues, branchId });
            setHolidays([]);
        } finally {
            changeLoaderState({ show: false });
        }
    }, [changeLoaderState, currentEntity?.entity?.id, defaultValues, t]);

    const validateSchedule = useCallback((values: BranchCalendarFormValues) => {
        const scheduleErrs: string[] = [];
        DAY_ITEMS.forEach((day) => {
            const dayValue = values.overridesSchedule[day.key];
            if (dayValue?.enabled) {
                if (!dayValue.start || !dayValue.end) {
                    scheduleErrs.push(t('errors.startEndRequired', { day: day.label }));
                } else if (minutesOf(dayValue.start) >= minutesOf(dayValue.end)) {
                    scheduleErrs.push(t('errors.startBeforeEnd', { day: day.label }));
                }
            }
        });
        setScheduleErrors(scheduleErrs);
        return scheduleErrs.length === 0;
    }, [t]);

    const handleSave = async (values: BranchCalendarFormValues, { setSubmitting, resetForm }: any) => {
        if (!currentEntity?.entity?.id || !values.branchId) {
            showToast(t('errors.badRequest'), 'error');
            setSubmitting(false);
            return;
        }
        if (!token) {
            showToast(t('errors.generic'), 'error');
            setSubmitting(false);
            return;
        }

        if (!values.disabled && !validateSchedule(values)) {
            setSubmitting(false);
            return;
        }

        try {
            changeLoaderState({ show: true, args: { text: t('actions.saving') } });
            const payloadSchedule = sanitizeSchedule(values.overridesSchedule, values.enableDayTimeRange);
            const advance = values.disabled ? undefined : {
                enableDayTimeRange: values.enableDayTimeRange,
                disableBreak: values.disableBreak,
                timeBreak: values.timeBreak,
                notifyBeforeMinutes: values.notifyBeforeMinutes,
            };
            await upsertCalendar({
                scope: "branch",
                entityId: currentEntity.entity.id,
                branchId: values.branchId,
                overridesSchedule: values.disabled ? undefined : payloadSchedule,
                timezone: values.disabled ? undefined : (currentEntity.entity.legal?.address?.timeZone ?? "UTC"),
                advance,
                disabled: values.disabled,
            }, token, currentLocale);
            resetForm({ values });
            setScheduleErrors([]);
            showToast(t('feedback.saved'), 'success');
        } catch (error: any) {
            showToast(t('errors.generic'), 'error');
        } finally {
            changeLoaderState({ show: false });
            setSubmitting(false);
        }
    };

    const handleHolidaySubmit = async (branchId: string, holiday: Holiday) => {
        if (!currentEntity?.entity?.id || !branchId) {
            showToast(t('errors.badRequest'), 'error');
            return;
        }
        if (!token) {
            showToast(t('errors.generic'), 'error');
            return;
        }
        try {
            changeLoaderState({ show: true, args: { text: t('actions.savingHoliday') } });
            await upsertCalendar({
                scope: "branch",
                entityId: currentEntity.entity.id,
                branchId,
                holiday,
            }, token, currentLocale);
            setHolidays((prev) => {
                const exists = prev.findIndex((item) => item.id === holiday.id);
                if (exists >= 0) {
                    const next = [...prev];
                    next[exists] = holiday;
                    return next;
                }
                return [...prev, holiday];
            });
            setOpenHolidayModal(false);
            setEditingHoliday(undefined);
            showToast(t('holidays.saved'), 'success');
        } catch (error: any) {
            showToast(t('errors.generic'), 'error');
        } finally {
            changeLoaderState({ show: false });
        }
    };

    const handleHolidayDelete = async (id: string, branchId: string) => {
        if (!currentEntity?.entity?.id || !branchId) {
            showToast(t('errors.badRequest'), 'error');
            return;
        }
        if (!token) {
            showToast(t('errors.generic'), 'error');
            return;
        }
        try {
            changeLoaderState({ show: true, args: { text: t('actions.deletingHoliday') } });
            await deleteCalendarItem({
                scope: "branch",
                kind: "holiday",
                entityId: currentEntity.entity.id,
                branchId,
                id,
            }, token, currentLocale);
            setHolidays((prev) => prev.filter((holiday) => holiday.id !== id));
            showToast(t('holidays.deleted'), 'success');
        } catch (error: any) {
            showToast(t('errors.generic'), 'error');
        } finally {
            changeLoaderState({ show: false });
        }
    };

    return (
        <Formik<BranchCalendarFormValues>
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleSave}
        >
            {({ values, setFieldValue, isSubmitting, dirty }) => {
                const disableSchedule = values.disabled;
                const totalWeeklyMinutes = useMemo(() => {
                    let total = 0;
                    DAY_ITEMS.forEach((day) => {
                        const dayValue = (values.overridesSchedule as any)?.[day.key];
                        if (dayValue?.enabled && dayValue.start && dayValue.end) {
                            const duration = minutesOf(dayValue.end) - minutesOf(dayValue.start);
                            const breakMinutes = values.disableBreak && values.timeBreak ? Number(values.timeBreak) : 0;
                            total += Math.max(0, duration - breakMinutes);
                        }
                    });
                    return total > 0 ? total : 0;
                }, [values.overridesSchedule, values.disableBreak, values.timeBreak]);

                const totalWeeklyHoursLabel = useMemo(() => {
                    const hours = Math.floor(totalWeeklyMinutes / 60);
                    const mins = totalWeeklyMinutes % 60;
                    if (hours === 0 && mins === 0) return '0h';
                    if (mins === 0) return `${hours}h`;
                    if (hours === 0) return `${mins}m`;
                    return `${hours}h ${mins}m`;
                }, [totalWeeklyMinutes]);
                return (
                    <Form>
                        <Stack spacing={3} sx={{ pb: 6 }}>
                            <Accordion defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                                    <Stack>
                                        <Typography fontWeight={600}>{t('tabs.branch')}</Typography>
                                        <Typography color="text.secondary" variant="body2">{t('subtitle')}</Typography>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Stack spacing={2}>
                                        <Typography variant="body2" color="text.secondary">{t('holidays.subtitle')}</Typography>
                                        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                                            <Select
                                                displayEmpty
                                                value={values.branchId}
                                                onChange={(e) => {
                                                    const branchId = e.target.value as string;
                                                    setFieldValue('branchId', branchId);
                                                    loadBranchCalendar(branchId);
                                                }}
                                                sx={{ minWidth: 220 }}
                                                renderValue={(selected) => {
                                                    if (!selected) return t('tabs.branch');
                                                    const current = branches.find(b => b.id === selected);
                                                    return current?.name ?? t('tabs.branch');
                                                }}
                                            >
                                                {branches.map((branch) => (
                                                    <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>
                                                ))}
                                            </Select>
                                            <FormControlLabel
                                                control={<Switch checked={!disableSchedule} onChange={(e) => {
                                                    const disabled = !e.target.checked;
                                                    setFieldValue('disabled', disabled);
                                                }} disabled={!values.branchId} />}
                                                label={disableSchedule ? tCore('workScheduleDisabled') : tCore('workScheduleEnable')}
                                            />
                                        </Box>
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion defaultExpanded disabled={!values.branchId}>
                                <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                                    <Stack>
                                        <Typography fontWeight={600}>{t('schedule.title')}</Typography>
                                        <Typography color="text.secondary" variant="body2">{t('schedule.subtitle')}</Typography>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <WorkScheduleField
                                        name="overridesSchedule"
                                        enableDayTimeRange
                                        workScheduleEnable={!disableSchedule}
                                    />

                                    <Divider sx={{ my: 2 }} />
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                                        <FormControlLabel
                                            control={<Switch checked={!!values.enableDayTimeRange} onChange={(e) => {
                                                setFieldValue('enableDayTimeRange', e.target.checked);
                                            }} disabled={disableSchedule} />}
                                            label={t('schedule.strictRange')}
                                        />
                                    </Stack>
                                    <Box
                                        sx={{
                                            mt: 2,
                                            bgcolor: values.enableDayTimeRange ? (theme) => theme.palette.primary.main : (theme) => theme.palette.grey[800],
                                            color: '#fff',
                                            p: 2,
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Stack spacing={0.5}>
                                            {values.enableDayTimeRange ? (
                                                <>
                                                    <Typography variant="body2">{t('schedule.strictInfo.line1')}</Typography>
                                                    <Typography variant="body2">{t('schedule.strictInfo.line2')}</Typography>
                                                    <Typography variant="body2">{t('schedule.strictInfo.line3')}</Typography>
                                                    <Typography variant="body2">{t('schedule.strictInfo.line4')}</Typography>
                                                </>
                                            ) : (
                                                <>
                                                    <Typography variant="body2">{t('schedule.flexInfo.line1')}</Typography>
                                                    <Typography variant="body2">{t('schedule.flexInfo.line2')}</Typography>
                                                    <Typography variant="body2">{t('schedule.flexInfo.line3')}</Typography>
                                                </>
                                            )}
                                        </Stack>
                                    </Box>

                                    <Divider sx={{ my: 3 }} />
                                    <Stack spacing={1}>
                                        <Typography fontWeight={600}>{tCore('weekTime')}</Typography>
                                        <Typography variant="h6">{totalWeeklyHoursLabel}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {tCore('adviseWorkDay')}: {values.notifyBeforeMinutes ?? 0} {tCore('minute')}
                                        </Typography>
                                    </Stack>

                                    <Divider sx={{ my: 3 }} />
                                    <Stack spacing={1.5}>
                                        <Typography fontWeight={600}>{tSucursal('breakTime')}</Typography>
                                        <Box
                                            sx={{
                                                borderRadius: 2,
                                                p: 2,
                                                bgcolor: values.disableBreak ? (theme) => theme.palette.primary.main : (theme) => theme.palette.grey[800],
                                                color: '#fff',
                                            }}
                                        >
                                            <Typography variant="body2">
                                                {values.disableBreak ? tSucursal('disableBreakAlertMessageE') : tSucursal('disableBreakAlertMessageD')}
                                            </Typography>
                                        </Box>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={!!values.disableBreak}
                                                        onChange={(e) => {
                                                            setFieldValue('disableBreak', e.target.checked);
                                                        }}
                                                        disabled={disableSchedule}
                                                    />
                                                }
                                                label={tSucursal('breakEnableText')}
                                            />
                                            <TextField
                                                name="timeBreak"
                                                type="number"
                                                value={values.timeBreak ?? ''}
                                                onChange={(e) => {
                                                    const parsed = Number(e.target.value);
                                                    setFieldValue('timeBreak', e.target.value === '' ? undefined : parsed);
                                                }}
                                                inputProps={{ min: 1 }}
                                                label={tCore('timeBreak')}
                                                disabled={!values.disableBreak || disableSchedule}
                                                sx={{
                                                    maxWidth: 200,
                                                }}
                                            />
                                        </Stack>
                                    </Stack>

                                    <Divider sx={{ my: 3 }} />
                                    <Stack spacing={1} maxWidth={320}>
                                        <Typography fontWeight={600}>{tCore('adviseWorkDay')}</Typography>
                                        <Typography variant="body2" color="text.secondary">{tCore('adviseWorkDayText')}</Typography>
                                        <TextField
                                            name="notifyBeforeMinutes"
                                            type="number"
                                            value={values.notifyBeforeMinutes ?? ''}
                                            onChange={(e) => {
                                                const parsed = Number(e.target.value);
                                                setFieldValue('notifyBeforeMinutes', e.target.value === '' ? undefined : parsed);
                                            }}
                                            inputProps={{ min: 0 }}
                                            label={tCore('minute')}
                                            disabled={disableSchedule}
                                        />
                                    </Stack>

                                    {scheduleErrors.length > 0 && <Alert sx={{ mt: 2 }} severity="error">
                                        <Stack spacing={0.5}>
                                            {scheduleErrors.map((err, idx) => <Typography key={idx} variant="body2">• {err}</Typography>)}
                                        </Stack>
                                    </Alert>}

                                    <Stack mt={3} spacing={1}>
                                        <Typography variant="body2">{t('notes.inheritance')}</Typography>
                                        <Typography variant="body2">{t('notes.inactiveDays')}</Typography>
                                        <Typography variant="body2">{t('notes.toleranceHint')}</Typography>
                                    </Stack>

                                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end" spacing={2} sx={{ mt: 3, mb: 2 }}>
                                        <SassButton
                                            type="submit"
                                            variant="contained"
                                            disabled={isSubmitting || !dirty || !values.branchId}
                                        >
                                            {t('actions.save')}
                                        </SassButton>
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion defaultExpanded disabled={!values.branchId}>
                                <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                                    <Stack>
                                        <Typography fontWeight={600}>{t('holidays.title')}</Typography>
                                        <Typography color="text.secondary" variant="body2">{t('holidays.subtitle')}</Typography>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box display="flex" justifyContent="flex-end" mb={2}>
                                        <SassButton
                                            variant="contained"
                                            startIcon={<AddOutlined />}
                                            onClick={() => {
                                                setEditingHoliday(undefined);
                                                setOpenHolidayModal(true);
                                            }}
                                            disabled={!values.branchId}
                                        >
                                            {t('actions.addHoliday')}
                                        </SassButton>
                                    </Box>

                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>{t('holidays.columns.name')}</TableCell>
                                                <TableCell>{t('holidays.columns.date')}</TableCell>
                                                <TableCell>{t('holidays.columns.description')}</TableCell>
                                                <TableCell align="right">{t('holidays.columns.actions')}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {holidays.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4}>
                                                        <Typography color="text.secondary">{t('holidays.empty')}</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {holidays.map((holiday) => (
                                                <TableRow key={holiday.id}>
                                                    <TableCell>{holiday.name}</TableCell>
                                                    <TableCell>{holiday.date}</TableCell>
                                                    <TableCell>{holiday.description || '--'}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton aria-label={t('actions.editHoliday')} onClick={() => {
                                                            setEditingHoliday(holiday);
                                                            setOpenHolidayModal(true);
                                                        }}>
                                                            <EditOutlined />
                                                        </IconButton>
                                                        <IconButton aria-label={t('actions.deleteHoliday')} onClick={() => handleHolidayDelete(holiday.id, values.branchId)}>
                                                            <DeleteOutline />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </AccordionDetails>
                            </Accordion>

                            {openHolidayModal && <HolidayModal
                                open={openHolidayModal}
                                initialValue={editingHoliday}
                                onClose={() => {
                                    setOpenHolidayModal(false);
                                    setEditingHoliday(undefined);
                                }}
                                onSubmit={(data) => {
                                    const id = data.id ?? `${data.name}-${data.date}`;
                                    return handleHolidaySubmit(values.branchId, { ...data, id });
                                }}
                            />}
                        </Stack>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default BranchCalendarTab;
