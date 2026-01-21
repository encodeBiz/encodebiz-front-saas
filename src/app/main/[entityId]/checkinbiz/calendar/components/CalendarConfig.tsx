'use client';

import { useEffect, useMemo, useState, useCallback } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Divider, FormControlLabel, IconButton, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { ExpandMoreOutlined, AddOutlined, EditOutlined, DeleteOutline } from "@mui/icons-material";
import { Formik, Form } from "formik";
import { useTranslations } from "next-intl";
import WorkScheduleField from "@/components/common/forms/fields/WorkScheduleField";
import { DayScheduleWithBreaks, Holiday, WeeklyScheduleWithBreaks } from "@/domain/features/checkinbiz/ICalendar";
import { useAppLocale } from "@/hooks/useAppLocale";
import { upsertCalendar, deleteCalendarItem } from "@/services/checkinbiz/calendar.service";
import HolidayModal from "./HolidayModal";
import { SassButton } from "@/components/common/buttons/GenericButton";

type Props = {
    scope: "entity" | "branch";
    entityId: string;
    branchId?: string;
    timezone?: string;
    token: string;
    locale?: any;
    initialSchedule?: WeeklyScheduleWithBreaks;
    initialAdvance?: {
        enableDayTimeRange?: boolean;
        disableBreak?: boolean;
        timeBreak?: number;
        notifyBeforeMinutes?: number;
    };
    initialDisabled?: boolean;
    initialHolidays?: Holiday[];
    onSaved?: () => void;
};

type FormValues = {
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

export function CalendarConfig({
    scope,
    entityId,
    branchId,
    timezone,
    initialSchedule,
    initialAdvance,
    initialDisabled,
    initialHolidays,
    onSaved,
}: Props) {
    const t = useTranslations('calendar');
    const tCore = useTranslations('core.label');
    const tSucursal = useTranslations('sucursal');
    const { currentLocale } = useAppLocale();

    const initialValues: FormValues = useMemo(() => ({
        overridesSchedule: initialSchedule ?? buildDefaultSchedule(),
        enableDayTimeRange: initialAdvance?.enableDayTimeRange ?? false,
        notifyBeforeMinutes: initialAdvance?.notifyBeforeMinutes ?? 15,
        disableBreak: initialAdvance?.disableBreak ?? false,
        timeBreak: initialAdvance?.timeBreak ?? 60,
        disabled: initialDisabled ?? false,
    }), [initialAdvance, initialDisabled, initialSchedule]);

    const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays ?? []);
    const [openHolidayModal, setOpenHolidayModal] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState<Holiday | undefined>();
    const [scheduleErrors, setScheduleErrors] = useState<string[]>([]);

    const validateSchedule = useCallback((values: FormValues) => {
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

    const handleSave = async (values: FormValues, { setSubmitting, resetForm }: any) => {
        if (!entityId || (scope === 'branch' && !branchId)) {
            setSubmitting(false);
            return;
        }

        if (!values.disabled && !validateSchedule(values)) {
            setSubmitting(false);
            return;
        }

        try {
            const payloadSchedule = sanitizeSchedule(values.overridesSchedule, values.enableDayTimeRange);
            const advance = values.disabled ? undefined : {
                enableDayTimeRange: values.enableDayTimeRange,
                disableBreak: values.disableBreak,
                timeBreak: values.timeBreak,
                notifyBeforeMinutes: values.notifyBeforeMinutes,
            };
            await upsertCalendar({
                scope,
                entityId,
                branchId,
                overridesSchedule: values.disabled ? undefined : payloadSchedule,
                defaultSchedule: scope === 'entity' ? payloadSchedule : undefined,
                timezone: values.disabled ? undefined : (timezone ?? "UTC"),
                advance,
                disabled: values.disabled,
            } as any, token, locale ?? currentLocale);
            resetForm({ values });
            setScheduleErrors([]);
            if (onSaved) onSaved();
        } catch (error) {
            // swallow for now
        } finally {
            setSubmitting(false);
        }
    };

    const handleHolidaySubmit = async (values: FormValues, holiday: Holiday) => {
        if (!entityId || (scope === 'branch' && !branchId)) {
            return;
        }
        try {
            await upsertCalendar({
                scope,
                entityId,
                branchId,
                holiday,
            } as any, token, locale ?? currentLocale);
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
        } catch (error) {
            // swallow for now
        }
    };

    const handleHolidayDelete = async (values: FormValues, id: string) => {
        if (!entityId || (scope === 'branch' && !branchId)) {
            return;
        }
        try {
            await deleteCalendarItem({
                scope,
                kind: "holiday",
                entityId,
                branchId,
                id,
            } as any, token, locale ?? currentLocale);
            setHolidays((prev) => prev.filter((holiday) => holiday.id !== id));
        } catch (error) {
            // swallow for now
        }
    };

    return (
        <Formik<FormValues>
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleSave}
        >
            {({ values, setFieldValue, isSubmitting, dirty, handleSubmit: submitFormik }) => {
                const disableSchedule = values.disabled;
                return (
                    <Form>
                        <Stack spacing={3}>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                                    <Stack>
                                        <Typography fontWeight={600}>{t('schedule.title')}</Typography>
                                        <Typography color="text.secondary" variant="body2">{t('schedule.subtitle')}</Typography>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <Stack spacing={1.5} alignItems="flex-start">
                                            <FormControlLabel
                                                control={<Switch checked={!disableSchedule} onChange={(e) => setFieldValue('disabled', !e.target.checked)} />}
                                                label={t('core.label.workScheduleEnable')}
                                            />
                                            <WorkScheduleField
                                                name="overridesSchedule"
                                                enableDayTimeRange
                                                workScheduleEnable={!disableSchedule}
                                            />
                                        </Stack>

                                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start" sx={{ width: '100%' }}>
                                            <Stack spacing={1.5} sx={{ flex: 1, minWidth: 320 }}>
                                                <FormControlLabel
                                                    control={<Switch checked={!!values.enableDayTimeRange} onChange={(e) => setFieldValue('enableDayTimeRange', e.target.checked)} disabled={disableSchedule} />}
                                                    label={t('schedule.strictRange')}
                                                />
                                                <Box>
                                                    <Typography fontWeight={700}>{tCore('adviseWorkDay')}</Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{tCore('adviseWorkDayText')}</Typography>
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
                                                        fullWidth
                                                    />
                                                </Box>
                                            </Stack>

                                            <Stack spacing={1.5} sx={{ flex: 1, minWidth: 280 }}>
                                                <Typography fontWeight={700}>{tSucursal('breakTime')}</Typography>
                                                <FormControlLabel
                                                    control={<Switch checked={!!values.disableBreak} onChange={(e) => setFieldValue('disableBreak', e.target.checked)} disabled={disableSchedule} />}
                                                    label={tSucursal('breakEnableText')}
                                                />
                                                {values.disableBreak && (
                                                    <Box sx={{ width: '100%', maxWidth: 240 }}>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                            {tCore('timeBreak')}
                                                        </Typography>
                                                        <TextField
                                                            name="timeBreak"
                                                            type="number"
                                                            value={values.timeBreak ?? ''}
                                                            onChange={(e) => {
                                                                const parsed = Number(e.target.value);
                                                                setFieldValue('timeBreak', e.target.value === '' ? undefined : parsed);
                                                            }}
                                                            inputProps={{ min: 1 }}
                                                            disabled={disableSchedule}
                                                            fullWidth
                                                        />
                                                    </Box>
                                                )}
                                            </Stack>
                                        </Stack>

                                        {scheduleErrors.length > 0 && <Alert sx={{ mt: 2 }} severity="error">
                                            <Stack spacing={0.5}>
                                                {scheduleErrors.map((err, idx) => <Typography key={idx} variant="body2">• {err}</Typography>)}
                                            </Stack>
                                        </Alert>}

                                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
                                            <SassButton
                                                type="button"
                                                variant="contained"
                                                disabled={isSubmitting || !dirty}
                                                onClick={() => submitFormik()}
                                            >
                                                {t('actions.save')}
                                            </SassButton>
                                        </Stack>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                                    <Stack>
                                        <Typography fontWeight={600}>{t('holidays.title')}</Typography>
                                        <Typography color="text.secondary" variant="body2">{t('holidays.subtitle')}</Typography>
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box display="flex" justifyContent="flex-end" mb={2}>
                                        <IconButton
                                            onClick={() => {
                                                setEditingHoliday(undefined);
                                                setOpenHolidayModal(true);
                                            }}
                                        >
                                            <AddOutlined />
                                        </IconButton>
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
                                                        <IconButton aria-label={t('actions.deleteHoliday')} onClick={() => handleHolidayDelete(values, holiday.id)}>
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
                                    return handleHolidaySubmit(values, { ...data, id });
                                }}
                            />}
                        </Stack>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default CalendarConfig;
