'use client';

import { useMemo, useState, useCallback, useEffect } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Divider, FormControlLabel, Grid, IconButton, Stack, Switch, TextField, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { ExpandMoreOutlined, AddOutlined, EditOutlined, DeleteOutline } from "@mui/icons-material";
import { Formik, Form } from "formik";
import WorkScheduleField from "@/components/common/forms/fields/WorkScheduleField";
import { DayScheduleWithBreaks, Holiday, WeeklyScheduleWithBreaks } from "@/domain/features/checkinbiz/ICalendar";
import { SassButton } from "@/components/common/buttons/GenericButton";
import { useTranslations } from "next-intl";
import HolidayModal from "./HolidayModal";
import { createSlug } from "@/lib/common/String";
import { useAuth } from "@/hooks/useAuth";
import { useAppLocale } from "@/hooks/useAppLocale";
import { useToast } from "@/hooks/useToast";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { upsertCalendar, deleteCalendarItem } from "@/services/checkinbiz/calendar.service";
import { getRefByPathData } from "@/lib/firebase/firestore/readDocument";

type EntityCalendarFormValues = {
    defaultSchedule: WeeklyScheduleWithBreaks;
    enableDayTimeRange: boolean;
    notifyBeforeMinutes?: number;
    disableBreak?: boolean;
    timeBreak?: number;
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

const parseError = (message?: string) => {
    if (!message) return { message: '' };
    try {
        return JSON.parse(message);
    } catch (error) {
        return { message };
    }
};

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

const EntityCalendarTab = () => {
    const t = useTranslations('calendar');
    const tCore = useTranslations('core.label');
    const tSucursal = useTranslations('sucursal');
    const { currentEntity } = useEntity();
    const { token } = useAuth();
    const { currentLocale } = useAppLocale();
    const { showToast } = useToast();
    const { changeLoaderState } = useLayout();
    const entityTimezone = currentEntity?.entity?.legal?.address?.timeZone ?? "UTC";

    const defaultInitialValues: EntityCalendarFormValues = useMemo(() => ({
        defaultSchedule: buildDefaultSchedule(),
        enableDayTimeRange: false,
        notifyBeforeMinutes: 15,
        disableBreak: false,
        timeBreak: 60,
    }), []);

    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [openHolidayModal, setOpenHolidayModal] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState<Holiday | undefined>();
    const [scheduleErrors, setScheduleErrors] = useState<string[]>([]);
    const [initialValues, setInitialValues] = useState<EntityCalendarFormValues>(defaultInitialValues);

    useEffect(() => {
        const loadConfig = async () => {
            if (!currentEntity?.entity?.id) return;
            try {
                const path = `entities/${currentEntity.entity.id}/calendar/config`;
                const data = await getRefByPathData(path);
                if (data) {
                    const storedSchedule: WeeklyScheduleWithBreaks = {};
                    DAY_ITEMS.forEach(day => {
                        const dayValue = data?.defaultSchedule?.[day.key];
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
                        defaultSchedule: storedSchedule,
                        enableDayTimeRange: advance.enableDayTimeRange ?? data.strictRange ?? false,
                        notifyBeforeMinutes: advance.notifyBeforeMinutes ?? data.notifyBeforeMinutes ?? 15,
                        disableBreak: advance.disableBreak ?? data.disableBreak ?? false,
                        timeBreak: advance.timeBreak ?? data.timeBreak ?? 60,
                    });

                    if (Array.isArray(data.holidays)) {
                        setHolidays(data.holidays);
                    } else if (data.holiday) {
                        setHolidays([data.holiday]);
                    } else {
                        setHolidays([]);
                    }
                } else {
                    setInitialValues(defaultInitialValues);
                    setHolidays([]);
                }
            } catch (error) {
                setInitialValues(defaultInitialValues);
                setHolidays([]);
            }
        };

        loadConfig();
    }, [currentEntity?.entity?.id, defaultInitialValues]);

    const validateForm = useCallback((values: EntityCalendarFormValues) => {
        const errors: any = {};
        const scheduleErrs: string[] = [];

        DAY_ITEMS.forEach((day) => {
            const dayValue = values.defaultSchedule[day.key];
            if (dayValue?.enabled) {
                if (!dayValue.start || !dayValue.end) {
                    scheduleErrs.push(t('errors.startEndRequired', { day: day.label }));
                } else if (minutesOf(dayValue.start) >= minutesOf(dayValue.end)) {
                    scheduleErrs.push(t('errors.startBeforeEnd', { day: day.label }));
                }

            }
        });

        if (scheduleErrs.length) {
            errors.defaultSchedule = scheduleErrs;
        }

        if (values.disableBreak && (values.timeBreak === undefined || values.timeBreak === null || Number.isNaN(Number(values.timeBreak)) || Number(values.timeBreak) <= 0)) {
            errors.timeBreak = t('errors.badRequest');
        }

        setScheduleErrors(scheduleErrs);
        return errors;
    }, [t]);

    const handleSave = async (values: EntityCalendarFormValues, { setSubmitting, resetForm }: any) => {
        if (!currentEntity?.entity?.id) {
            showToast(t('errors.noEntity'), 'error');
            return;
        }
        if (!token) {
            showToast(t('errors.generic'), 'error');
            return;
        }
        try {
            changeLoaderState({ show: true, args: { text: t('actions.saving') } });
            const payloadSchedule = sanitizeSchedule(values.defaultSchedule, values.enableDayTimeRange);
            const advance = {
                enableDayTimeRange: values.enableDayTimeRange,
                disableBreak: values.disableBreak,
                timeBreak: values.timeBreak,
                notifyBeforeMinutes: values.notifyBeforeMinutes,
            };
            await upsertCalendar({
                scope: "entity",
                entityId: currentEntity.entity.id,
                defaultSchedule: payloadSchedule,
                timezone: entityTimezone ?? "",
                advance,
            }, token, currentLocale);
            resetForm({ values });
            setScheduleErrors([]);
            showToast(t('feedback.saved'), 'success');
        } catch (error: any) {
            const parsed = parseError(error?.message);
            if (parsed.code === 'calendar/bad_request') {
                showToast(t('errors.badRequest'), 'error');
            } else if (parsed.code === 'calendar/not_found') {
                showToast(t('errors.notFound'), 'error');
            } else {
                showToast(parsed?.message || t('errors.generic'), 'error');
            }
        } finally {
            changeLoaderState({ show: false });
            setSubmitting(false);
        }
    };

    const handleHolidaySubmit = async (holiday: Holiday) => {
        if (!currentEntity?.entity?.id) {
            showToast(t('errors.noEntity'), 'error');
            return;
        }
        if (!token) {
            showToast(t('errors.generic'), 'error');
            return;
        }
        try {
            changeLoaderState({ show: true, args: { text: t('actions.savingHoliday') } });
            await upsertCalendar({
                scope: "entity",
                entityId: currentEntity.entity.id,
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
            const parsed = parseError(error?.message);
            if (parsed.code === 'calendar/bad_request') {
                showToast(t('errors.badRequest'), 'error');
            } else if (parsed.code === 'calendar/not_found') {
                showToast(t('errors.notFound'), 'error');
            } else {
                showToast(parsed?.message || t('errors.generic'), 'error');
            }
        } finally {
            changeLoaderState({ show: false });
        }
    };

    const handleHolidayDelete = async (id: string) => {
        if (!currentEntity?.entity?.id) {
            showToast(t('errors.noEntity'), 'error');
            return;
        }
        if (!token) {
            showToast(t('errors.generic'), 'error');
            return;
        }
        try {
            changeLoaderState({ show: true, args: { text: t('actions.deletingHoliday') } });
            await deleteCalendarItem({
                scope: "entity",
                kind: "holiday",
                entityId: currentEntity.entity.id,
                id,
            }, token, currentLocale);
            setHolidays((prev) => prev.filter((holiday) => holiday.id !== id));
            showToast(t('holidays.deleted'), 'success');
        } catch (error: any) {
            const parsed = parseError(error?.message);
            if (parsed.code === 'calendar/bad_request') {
                showToast(t('errors.badRequest'), 'error');
            } else if (parsed.code === 'calendar/not_found') {
                showToast(t('errors.notFound'), 'error');
            } else {
                showToast(parsed?.message || t('errors.generic'), 'error');
            }
        } finally {
            changeLoaderState({ show: false });
        }
    };

    return (
        <Formik<EntityCalendarFormValues>
            initialValues={initialValues}
            onSubmit={handleSave}
            validate={validateForm}
            enableReinitialize
        >
            {({ values, setFieldValue, errors, isSubmitting, dirty }) => (
                <Form>
                    <Stack spacing={3} sx={{ pb: 6 }}>
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                                <Stack>
                                    <Typography fontWeight={600}>{t('schedule.title')}</Typography>
                                    <Typography color="text.secondary" variant="body2">{t('schedule.subtitle')}</Typography>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <WorkScheduleField
                                    name="defaultSchedule"
                                    enableDayTimeRange
                                    workScheduleEnable
                                />

                                <Divider sx={{ my: 2 }} />
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                                    <FormControlLabel
                                        control={<Switch checked={values.enableDayTimeRange} onChange={(e) => setFieldValue('enableDayTimeRange', e.target.checked)} />}
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
                                                    onChange={(e) => setFieldValue('disableBreak', e.target.checked)}
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
                                        disabled={!values.disableBreak}
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
                                        disabled={isSubmitting || !dirty}
                                    >
                                        {t('actions.save')}
                                    </SassButton>
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
                                <Box display="flex" justifyContent="flex-end" mb={2}>
                                    <SassButton
                                        variant="contained"
                                        startIcon={<AddOutlined />}
                                        onClick={() => {
                                            setEditingHoliday(undefined);
                                            setOpenHolidayModal(true);
                                        }}
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
                                                    <IconButton aria-label={t('actions.deleteHoliday')} onClick={() => handleHolidayDelete(holiday.id)}>
                                                        <DeleteOutline />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>

                    </Stack>

                    {openHolidayModal && <HolidayModal
                        open={openHolidayModal}
                        initialValue={editingHoliday}
                        onClose={() => {
                            setOpenHolidayModal(false);
                            setEditingHoliday(undefined);
                        }}
                        onSubmit={(data) => {
                            const id = data.id ?? `${createSlug(data.name)}-${data.date}`;
                            return handleHolidaySubmit({ ...data, id });
                        }}
                    />}
                </Form>
            )}
        </Formik>
    );
};

export default EntityCalendarTab;
