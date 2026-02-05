'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ExpandMoreOutlined, AddOutlined, EditOutlined, DeleteOutline } from "@mui/icons-material";
import { Formik, useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import { Holiday, WeeklyScheduleWithBreaks } from "@/domain/features/checkinbiz/ICalendar";
import WorkScheduleField from "@/components/common/forms/fields/WorkScheduleField";
import { SassButton } from "@/components/common/buttons/GenericButton";
import HolidayModal from "./HolidayModal";
import { useAppLocale } from "@/hooks/useAppLocale";
import { upsertCalendar, deleteCalendarItem } from "@/services/checkinbiz/calendar.service";
import { createSlug } from "@/lib/common/String";

type Props = {
  scope: "entity" | "branch" | "employee";
  entityId: string;
  branchId?: string;
  employeeId?: string;
  timezone?: string;
  token: string;
  locale?: any;
  initialSchedule?: WeeklyScheduleWithBreaks;
  baseSchedule?: WeeklyScheduleWithBreaks;
  overrideSchedule?: WeeklyScheduleWithBreaks;
  initialAdvance?: {
    enableDayTimeRange?: boolean;
    disableBreak?: boolean;
    timeBreak?: number;
    notifyBeforeMinutes?: number;
  };
  baseAdvance?: {
    enableDayTimeRange?: boolean;
    disableBreak?: boolean;
    timeBreak?: number;
    notifyBeforeMinutes?: number;
  };
  overrideAdvance?: {
    enableDayTimeRange?: boolean;
    disableBreak?: boolean;
    timeBreak?: number;
    notifyBeforeMinutes?: number;
  };
  initialOverridesDisabled?: boolean;
  initialHolidays?: Holiday[];
  formFieldName?: string;
  setParentFieldValue?: (name: string, value: any) => void;
  onSaved?: () => void;
  hideSaveButton?: boolean;
  disableHolidayActions?: boolean;
  onChange?: (data: {
    values: FormValues;
    payloadSchedule: WeeklyScheduleWithBreaks;
    advance: {
      enableDayTimeRange: boolean;
      disableBreak?: boolean;
      timeBreak?: number;
      notifyBeforeMinutes?: number;
    };
    holidays: Holiday[];
    dirty: boolean;
    overridesDisabled: boolean;
  }) => void;
};

type FormValues = {
  schedule: WeeklyScheduleWithBreaks;
  enableDayTimeRange: boolean;
  notifyBeforeMinutes?: number;
  disableBreak?: boolean;
  timeBreak?: number;
  overridesDisabled: boolean;
};

const DAY_ITEMS = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
] as const;

const minutesOf = (time?: { hour?: number; minute?: number }) => (time?.hour ?? 0) * 60 + (time?.minute ?? 0);

const sanitizeSchedule = (schedule: WeeklyScheduleWithBreaks, enableDayTimeRange: boolean): WeeklyScheduleWithBreaks => {
  const cleaned: WeeklyScheduleWithBreaks = {};
  DAY_ITEMS.forEach((day) => {
    const dayValue = schedule[day.key] ?? {};
    const shifts = Array.isArray((dayValue as any).shifts) && (dayValue as any).shifts.length
      ? (dayValue as any).shifts.map((s: any, idx: number) => ({
        start: s?.start ?? { hour: 9, minute: 0 },
        end: s?.end ?? { hour: 17, minute: 0 },
        id: s?.id ?? `shift-${idx}`,
      }))
      : [{ start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 }, id: 'shift-0' }];
    const isDisabled = dayValue.disabled ?? (dayValue.enabled === false);
    cleaned[day.key] = {
      shifts,
      strictRange: enableDayTimeRange || dayValue.strictRange ? true : undefined,
      toleranceMinutes: dayValue.toleranceMinutes,
      disabled: isDisabled,
    };
  });
  return cleaned;
};

const CalendarChangeReporter = ({
  holidays,
  onChange,
  onHashChange,
}: {
  holidays: Holiday[];
  onChange?: (data: {
    values: FormValues;
    payloadSchedule: WeeklyScheduleWithBreaks;
    advance: {
      enableDayTimeRange: boolean;
      disableBreak?: boolean;
      timeBreak?: number;
      notifyBeforeMinutes?: number;
    };
    holidays: Holiday[];
    dirty: boolean;
    overridesDisabled: boolean;
  }) => void;
  onHashChange?: (hash: string) => void;
}) => {
  const { values, dirty } = useFormikContext<FormValues>();
  const payloadSchedule = useMemo(() => sanitizeSchedule(values.schedule, values.enableDayTimeRange), [values.schedule, values.enableDayTimeRange]);
  const advance = useMemo(
    () => ({
      enableDayTimeRange: values.enableDayTimeRange,
      disableBreak: values.disableBreak,
      timeBreak: values.timeBreak,
      notifyBeforeMinutes: values.notifyBeforeMinutes,
    }),
    [values.disableBreak, values.enableDayTimeRange, values.notifyBeforeMinutes, values.timeBreak]
  );
  const changeKey = useMemo(() => JSON.stringify({ payloadSchedule, advance, holidays, overridesDisabled: values.overridesDisabled }), [advance, holidays, payloadSchedule, values.overridesDisabled]);
  const lastKey = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (lastKey.current === changeKey) return;
    lastKey.current = changeKey;
    if (onChange) {
      onChange({ values, payloadSchedule, advance, holidays, dirty, overridesDisabled: values.overridesDisabled });
    }
    if (onHashChange) onHashChange(changeKey);
  }, [advance, changeKey, dirty, holidays, onChange, payloadSchedule, values, onHashChange]);

  return null;
};

const CalendarSection = ({
  scope,
  entityId,
  branchId,
  employeeId,
  timezone,
  token,
  locale,
  initialSchedule,
  baseSchedule,
  overrideSchedule,
  initialAdvance,
  baseAdvance,
  overrideAdvance,
  initialOverridesDisabled,
  initialHolidays,
  formFieldName,
  setParentFieldValue,
  onSaved,
  hideSaveButton = false,
  disableHolidayActions = false,
  onChange,
}: Props) => {
  const t = useTranslations("calendar");
  const tCore = useTranslations("core.label");
  const tSucursal = useTranslations("sucursal");
  const { currentLocale } = useAppLocale();

  const normalizeScheduleForForm = useCallback((schedule?: WeeklyScheduleWithBreaks, fallback?: WeeklyScheduleWithBreaks) => {
    const normalized: WeeklyScheduleWithBreaks = {};
    DAY_ITEMS.forEach((day) => {
      const dayValue = schedule?.[day.key] ?? fallback?.[day.key];
      if (dayValue) {
        const enabled = dayValue.disabled ? false : dayValue.enabled ?? true;
        const shifts = Array.isArray((dayValue as any).shifts) && (dayValue as any).shifts.length
          ? (dayValue as any).shifts
          : [{
            start: (dayValue as any).start ?? { hour: 9, minute: 0 },
            end: (dayValue as any).end ?? { hour: 17, minute: 0 },
            id: 'shift-0'
          }];
        normalized[day.key] = { ...dayValue, shifts, enabled, disabled: dayValue.disabled ?? !enabled };
      } else {
        normalized[day.key] = {
          enabled: false,
          disabled: true,
          shifts: [{
            start: { hour: 9, minute: 0 },
            end: { hour: 17, minute: 0 },
            id: 'shift-0',
          }],
        };
      }
    });
    return normalized;
  }, []);

  const initialValues: FormValues = useMemo(() => {
    const overridesDisabledDefault = initialOverridesDisabled ?? (scope !== "entity");
    const scheduleSource = overridesDisabledDefault ? baseSchedule ?? initialSchedule : overrideSchedule ?? initialSchedule ?? baseSchedule;
    const advanceSource = overridesDisabledDefault ? baseAdvance ?? initialAdvance : overrideAdvance ?? initialAdvance ?? baseAdvance;
    const normalizedSchedule = normalizeScheduleForForm(scheduleSource, baseSchedule ?? initialSchedule);
    return {
      schedule: normalizedSchedule,
      enableDayTimeRange: advanceSource?.enableDayTimeRange ?? false,
      notifyBeforeMinutes: advanceSource?.notifyBeforeMinutes ?? 15,
      disableBreak: advanceSource?.disableBreak ?? false,
      timeBreak: advanceSource?.timeBreak ?? 60,
      overridesDisabled: overridesDisabledDefault,
    };
  }, [baseAdvance, baseSchedule, initialAdvance, initialOverridesDisabled, initialSchedule, normalizeScheduleForForm, overrideAdvance, overrideSchedule, scope]);

  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays ?? []);
  const [openHolidayModal, setOpenHolidayModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | undefined>();
  const [scheduleErrors, setScheduleErrors] = useState<string[]>([]);
  const accordionInitialExpanded = !hideSaveButton && !(initialOverridesDisabled ?? (scope !== "entity"));
  const [scheduleExpanded, setScheduleExpanded] = useState<boolean>(accordionInitialExpanded);

  useEffect(() => {
    setScheduleExpanded(!hideSaveButton && !(initialOverridesDisabled ?? false));
  }, [hideSaveButton, initialOverridesDisabled]);

  useEffect(() => {
    setHolidays(initialHolidays ?? []);
  }, [initialHolidays]);

  const validateForm = useCallback(
    (values: FormValues) => {
      const errors: any = {};
      const scheduleErrs: string[] = [];

      DAY_ITEMS.forEach((day) => {
        const dayValue = values.schedule[day.key];
        if (!values.overridesDisabled && dayValue?.enabled) {
          const shifts: any[] = Array.isArray((dayValue as any)?.shifts) ? (dayValue as any).shifts : [];
          if (!shifts.length) {
            scheduleErrs.push(t("errors.startEndRequired", { day: day.label }));
          } else {
            shifts.forEach((s, idx) => {
              const start = s?.start;
              const end = s?.end;
              if (!start || !end) {
                scheduleErrs.push(t("errors.startEndRequired", { day: `${day.label} #${idx + 1}` }));
              } else if (minutesOf(start) >= minutesOf(end)) {
                scheduleErrs.push(t("errors.startBeforeEnd", { day: `${day.label} #${idx + 1}` }));
              }
            });
          }
        }
      });

      if (scheduleErrs.length) {
        errors.schedule = scheduleErrs;
      }

      if (
        values.disableBreak &&
        (values.timeBreak === undefined || values.timeBreak === null || Number.isNaN(Number(values.timeBreak)) || Number(values.timeBreak) <= 0)
      ) {
        errors.timeBreak = t("errors.badRequest");
      }

      setScheduleErrors(scheduleErrs);
      return errors;
    },
    [t]
  );

  const handleSave = async (values: FormValues, { setSubmitting, resetForm }: any) => {
    if (!entityId || (scope === "branch" && !branchId) || (scope === "employee" && !employeeId)) {
      setSubmitting(false);
      return;
    }
    if (!token) {
      setSubmitting(false);
      return;
    }
    try {
      const payloadSchedule = sanitizeSchedule(values.schedule, values.enableDayTimeRange);
      const advance = {
        enableDayTimeRange: values.enableDayTimeRange,
        disableBreak: values.disableBreak,
        timeBreak: values.timeBreak,
        notifyBeforeMinutes: values.notifyBeforeMinutes,
      };
      await upsertCalendar(
        {
          scope,
          entityId,
          branchId,
          employeeId,
          defaultSchedule: scope === "entity" ? payloadSchedule : undefined,
          overridesSchedule: scope !== "entity" ? payloadSchedule : undefined,
          timezone: timezone ?? "UTC",
          advance,
          overridesDisabled: values.overridesDisabled,
        } as any,
        token,
        locale ?? currentLocale
      );
      resetForm({ values });
      setScheduleErrors([]);
      if (onSaved) onSaved();
    } catch (error) {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const handleHolidaySubmit = async (holiday: Holiday) => {
    if (!entityId || (scope === "branch" && !branchId) || (scope === "employee" && !employeeId)) return;
    if (!token) return;
    await upsertCalendar(
      {
        scope,
        entityId,
        branchId,
        employeeId,
        holiday,
      } as any,
      token,
      locale ?? currentLocale
    );
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
  };

  const handleHolidayDelete = async (id: string) => {
    if (!entityId || (scope === "branch" && !branchId) || (scope === "employee" && !employeeId)) return;
    if (!token) return;
    await deleteCalendarItem(
      {
        scope,
        kind: "holiday",
        entityId,
        branchId,
        employeeId,
        id,
      } as any,
      token,
      locale ?? currentLocale
    );
    setHolidays((prev) => prev.filter((holiday) => holiday.id !== id));
  };

  return (
    <Formik<FormValues> initialValues={initialValues} onSubmit={handleSave} validate={validateForm} enableReinitialize>
      {({ values, setFieldValue, isSubmitting, dirty, handleSubmit }) => {
        const isOverridesDisabled = values.overridesDisabled;

        const handleScheduleAccordionChange = (_: any, expanded: boolean) => {
          if (isOverridesDisabled) return;
          setScheduleExpanded(expanded);
        };

        // Sincroniza el switch con el valor que viene del config (cuando rehidrata el formulario)
        useEffect(() => {
          const fallbackOverrides = initialOverridesDisabled ?? (scope !== "entity");
          const scheduleSource = fallbackOverrides ? baseSchedule ?? initialSchedule : overrideSchedule ?? initialSchedule ?? baseSchedule;
          const advanceSource = fallbackOverrides ? baseAdvance ?? initialAdvance : overrideAdvance ?? initialAdvance ?? baseAdvance;

          setFieldValue("overridesDisabled", fallbackOverrides, false);
          setFieldValue("schedule", normalizeScheduleForForm(scheduleSource, baseSchedule ?? initialSchedule), false);
          setFieldValue("enableDayTimeRange", advanceSource?.enableDayTimeRange ?? false, false);
          setFieldValue("notifyBeforeMinutes", advanceSource?.notifyBeforeMinutes ?? 15, false);
          setFieldValue("disableBreak", advanceSource?.disableBreak ?? false, false);
          setFieldValue("timeBreak", advanceSource?.timeBreak ?? 60, false);
          setScheduleExpanded(!hideSaveButton && !fallbackOverrides);
        }, [
          baseAdvance,
          baseSchedule,
          hideSaveButton,
          initialAdvance,
          initialOverridesDisabled,
          initialSchedule,
          normalizeScheduleForForm,
          overrideAdvance,
          overrideSchedule,
          scope,
          setFieldValue,
        ]);

        return (
          <Stack spacing={3} sx={{ pb: 6, textAlign: "left" }}>
            <CalendarChangeReporter
              holidays={holidays}
              onChange={onChange}
              onHashChange={(hash) => {
                if (formFieldName && setParentFieldValue) {
                  setParentFieldValue(formFieldName, hash);
                }
              }}
            />
            <Accordion expanded={!isOverridesDisabled && scheduleExpanded} onChange={handleScheduleAccordionChange}>
              <AccordionSummary
                expandIcon={<ExpandMoreOutlined color={isOverridesDisabled ? "disabled" : undefined} />}
                sx={{ "& .MuiAccordionSummary-content": { alignItems: "center", gap: 2 } }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" gap={2}>
                  <Stack flexGrow={1}>
                    <Typography fontWeight={600}>{t("schedule.title")}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {t("schedule.subtitle")}
                    </Typography>
                  </Stack>
                  {scope !== "entity" && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      onClick={(e) => e.stopPropagation()}
                      sx={{ pr: 1 }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {t("schedule.baseSchedule")}
                      </Typography>
                      <Switch
                        size="small"
                        checked={!!values.overridesDisabled}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const nextSchedule = checked
                            ? normalizeScheduleForForm(baseSchedule ?? initialSchedule, initialSchedule)
                            : normalizeScheduleForForm(overrideSchedule ?? initialSchedule ?? baseSchedule, baseSchedule ?? initialSchedule);
                          const nextAdvance = checked
                            ? baseAdvance ?? initialAdvance
                            : overrideAdvance ?? initialAdvance ?? baseAdvance;

                          setFieldValue("overridesDisabled", checked);
                          setFieldValue("schedule", nextSchedule, false);
                          setFieldValue("enableDayTimeRange", nextAdvance?.enableDayTimeRange ?? false, false);
                          setFieldValue("notifyBeforeMinutes", nextAdvance?.notifyBeforeMinutes ?? 15, false);
                          setFieldValue("disableBreak", nextAdvance?.disableBreak ?? false, false);
                          setFieldValue("timeBreak", nextAdvance?.timeBreak ?? 60, false);
                          setScheduleExpanded(!checked);
                        }}
                      />
                    </Stack>
                  )}
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <WorkScheduleField
                  name="schedule"
                  enableDayTimeRange={values.enableDayTimeRange}
                  workScheduleEnable={!isOverridesDisabled}
                  onBulkApply={() => setScheduleExpanded(true)}
                />

                <Divider sx={{ my: 2 }} />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.enableDayTimeRange}
                        onChange={(e) => setFieldValue("enableDayTimeRange", e.target.checked)}
                        disabled={isOverridesDisabled}
                      />
                    }
                    label={t("schedule.strictRange")}
                  />
                </Stack>
                <Box
                  sx={{
                    mt: 2,
                    bgcolor: values.enableDayTimeRange ? (theme) => theme.palette.primary.main : (theme) => theme.palette.grey[800],
                    color: "#fff",
                    p: 2,
                    borderRadius: 2,
                  }}
                >
                  {values.enableDayTimeRange ? (
                    <Stack spacing={0.5}>
                      <Typography variant="body2">{t("schedule.strictInfo.line1")}</Typography>
                      <Typography variant="body2">{t("schedule.strictInfo.line2")}</Typography>
                      <Typography variant="body2">{t("schedule.strictInfo.line3")}</Typography>
                      <Typography variant="body2">{t("schedule.strictInfo.line4")}</Typography>
                    </Stack>
                  ) : (
                    <Stack spacing={0.5}>
                      <Typography variant="body2">{t("schedule.flexInfo.line1")}</Typography>
                      <Typography variant="body2">{t("schedule.flexInfo.line2")}</Typography>
                      <Typography variant="body2">{t("schedule.flexInfo.line3")}</Typography>
                    </Stack>
                  )}
                </Box>

                <Divider sx={{ my: 3 }} />
                <Stack spacing={1.5}>
                  <Typography fontWeight={600}>{tSucursal("breakTime")}</Typography>
                  <Box
                    sx={{
                      borderRadius: 2,
                      p: 2,
                      bgcolor: values.disableBreak ? (theme) => theme.palette.primary.main : (theme) => theme.palette.grey[800],
                      color: "#fff",
                    }}
                  >
                    <Typography variant="body2">
                      {values.disableBreak ? tSucursal("disableBreakAlertMessageE") : tSucursal("disableBreakAlertMessageD")}
                    </Typography>
                  </Box>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!values.disableBreak}
                          onChange={(e) => setFieldValue("disableBreak", e.target.checked)}
                          disabled={isOverridesDisabled}
                        />
                      }
                      label={tSucursal("breakEnableText")}
                    />
                    <TextField
                      name="timeBreak"
                      type="number"
                      value={values.timeBreak ?? ""}
                      onChange={(e) => {
                        const parsed = Number(e.target.value);
                        setFieldValue("timeBreak", e.target.value === "" ? undefined : parsed);
                      }}
                      inputProps={{ min: 1 }}
                      label={tCore("timeBreak")}
                      disabled={!values.disableBreak || isOverridesDisabled}
                    />
                  </Stack>
                </Stack>

                <Divider sx={{ my: 3 }} />
                <Stack spacing={1} maxWidth={320}>
                  <Typography fontWeight={600}>{tCore("adviseWorkDay")}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tCore("adviseWorkDayText")}
                  </Typography>
                  <TextField
                    name="notifyBeforeMinutes"
                    type="number"
                    value={values.notifyBeforeMinutes ?? ""}
                    onChange={(e) => {
                      const parsed = Number(e.target.value);
                      setFieldValue("notifyBeforeMinutes", e.target.value === "" ? undefined : parsed);
                    }}
                    inputProps={{ min: 0 }}
                    label={tCore("minute")}
                    disabled={isOverridesDisabled}
                  />
                </Stack>

                {scheduleErrors.length > 0 && (
                  <Alert sx={{ mt: 2 }} severity="error">
                    <Stack spacing={0.5}>
                      {scheduleErrors.map((err, idx) => (
                        <Typography key={idx} variant="body2">
                          • {err}
                        </Typography>
                      ))}
                    </Stack>
                  </Alert>
                )}

                <Stack mt={3} spacing={1}>
                  <Typography variant="body2">{t("notes.inheritance")}</Typography>
                  <Typography variant="body2">{t("notes.inactiveDays")}</Typography>
                  <Typography variant="body2">{t("notes.toleranceHint")}</Typography>
                </Stack>

                {!hideSaveButton && (
                  <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" spacing={2} sx={{ mt: 3, mb: 2 }}>
                    <SassButton type="button" variant="contained" disabled={isSubmitting || !dirty} onClick={() => handleSubmit()}>
                      {t("actions.save")}
                    </SassButton>
                  </Stack>
                )}
            </AccordionDetails>
          </Accordion>

          {openHolidayModal && !disableHolidayActions && (
            <HolidayModal
              open={openHolidayModal}
              scope={scope}
                initialValue={editingHoliday}
                existingDates={holidays.map((h) => h.date)}
                onClose={() => {
                  setOpenHolidayModal(false);
                  setEditingHoliday(undefined);
                }}
                onSubmit={(data) => {
                  const id = data.id ?? `${createSlug(data.name)}-${data.date}`;
                  return handleHolidaySubmit({ ...data, id });
                }}
              />
            )}
          </Stack>
        );
      }}
    </Formik>
  );
};

export default CalendarSection;
