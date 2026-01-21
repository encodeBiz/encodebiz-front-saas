'use client';

import { useCallback, useMemo, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Divider, FormControlLabel, IconButton, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { ExpandMoreOutlined, AddOutlined, EditOutlined, DeleteOutline } from "@mui/icons-material";
import { Formik } from "formik";
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
  initialAdvance?: {
    enableDayTimeRange?: boolean;
    disableBreak?: boolean;
    timeBreak?: number;
    notifyBeforeMinutes?: number;
  };
  initialHolidays?: Holiday[];
  onSaved?: () => void;
};

type FormValues = {
  schedule: WeeklyScheduleWithBreaks;
  enableDayTimeRange: boolean;
  notifyBeforeMinutes?: number;
  disableBreak?: boolean;
  timeBreak?: number;
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

const minutesOf = (time?: { hour?: number; minute?: number }) =>
  (time?.hour ?? 0) * 60 + (time?.minute ?? 0);

const sanitizeSchedule = (
  schedule: WeeklyScheduleWithBreaks,
  enableDayTimeRange: boolean
): WeeklyScheduleWithBreaks => {
  const cleaned: WeeklyScheduleWithBreaks = {};
  DAY_ITEMS.forEach((day) => {
    const dayValue = schedule[day.key];
    if (
      dayValue?.enabled &&
      dayValue.start &&
      dayValue.end &&
      minutesOf(dayValue.start) < minutesOf(dayValue.end)
    ) {
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

const CalendarSection = ({
  scope,
  entityId,
  branchId,
  employeeId,
  timezone,
  token,
  locale,
  initialSchedule,
  initialAdvance,
  initialHolidays,
  onSaved,
}: Props) => {
  const t = useTranslations("calendar");
  const tCore = useTranslations("core.label");
  const tSucursal = useTranslations("sucursal");
  const { currentLocale } = useAppLocale();

  const initialValues: FormValues = useMemo(
    () => ({
      schedule: initialSchedule ?? {},
      enableDayTimeRange: initialAdvance?.enableDayTimeRange ?? false,
      notifyBeforeMinutes: initialAdvance?.notifyBeforeMinutes ?? 15,
      disableBreak: initialAdvance?.disableBreak ?? false,
      timeBreak: initialAdvance?.timeBreak ?? 60,
    }),
    [initialAdvance, initialSchedule]
  );

  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays ?? []);
  const [openHolidayModal, setOpenHolidayModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | undefined>();
  const [scheduleErrors, setScheduleErrors] = useState<string[]>([]);

  const validateForm = useCallback(
    (values: FormValues) => {
      const errors: any = {};
      const scheduleErrs: string[] = [];

      DAY_ITEMS.forEach((day) => {
        const dayValue = values.schedule[day.key];
        if (dayValue?.enabled) {
          if (!dayValue.start || !dayValue.end) {
            scheduleErrs.push(t("errors.startEndRequired", { day: day.label }));
          } else if (minutesOf(dayValue.start) >= minutesOf(dayValue.end)) {
            scheduleErrs.push(t("errors.startBeforeEnd", { day: day.label }));
          }
        }
      });

      if (scheduleErrs.length) {
        errors.schedule = scheduleErrs;
      }

      if (
        values.disableBreak &&
        (values.timeBreak === undefined ||
          values.timeBreak === null ||
          Number.isNaN(Number(values.timeBreak)) ||
          Number(values.timeBreak) <= 0)
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
      {({ values, setFieldValue, isSubmitting, dirty, handleSubmit }) => (
        <Stack spacing={3} sx={{ pb: 6, textAlign: "left" }}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                <Stack>
                  <Typography fontWeight={600}>{t("schedule.title")}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {t("schedule.subtitle")}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <WorkScheduleField name="schedule" enableDayTimeRange workScheduleEnable />

                <Divider sx={{ my: 2 }} />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.enableDayTimeRange}
                        onChange={(e) => setFieldValue("enableDayTimeRange", e.target.checked)}
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
                      disabled={!values.disableBreak}
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

                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" spacing={2} sx={{ mt: 3, mb: 2 }}>
                  <SassButton type="button" variant="contained" disabled={isSubmitting || !dirty} onClick={() => handleSubmit()}>
                    {t("actions.save")}
                  </SassButton>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                <Stack>
                  <Typography fontWeight={600}>{t("holidays.title")}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {t("holidays.subtitle")}
                  </Typography>
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
                    {t("actions.addHoliday")}
                  </SassButton>
                </Box>

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("holidays.columns.name")}</TableCell>
                      <TableCell>{t("holidays.columns.date")}</TableCell>
                      <TableCell>{t("holidays.columns.description")}</TableCell>
                      <TableCell align="right">{t("holidays.columns.actions")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {holidays.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography color="text.secondary">{t("holidays.empty")}</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {holidays.map((holiday) => (
                      <TableRow key={holiday.id}>
                        <TableCell>{holiday.name}</TableCell>
                        <TableCell>{holiday.date}</TableCell>
                        <TableCell>{holiday.description || "--"}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            aria-label={t("actions.editHoliday")}
                            onClick={() => {
                              setEditingHoliday(holiday);
                              setOpenHolidayModal(true);
                            }}
                          >
                            <EditOutlined />
                          </IconButton>
                          <IconButton aria-label={t("actions.deleteHoliday")} onClick={() => handleHolidayDelete(holiday.id)}>
                            <DeleteOutline />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>

            {openHolidayModal && (
              <HolidayModal
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
              />
            )}
        </Stack>
      )}
    </Formik>
  );
};

export default CalendarSection;
