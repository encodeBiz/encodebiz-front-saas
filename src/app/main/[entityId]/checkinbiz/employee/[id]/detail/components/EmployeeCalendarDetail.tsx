'use client';

import { useEffect, useMemo, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Divider, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AccessTime, AlarmOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { WeeklyScheduleWithBreaks, Holiday } from "@/domain/features/checkinbiz/ICalendar";
import { IEmployee } from "@/domain/features/checkinbiz/IEmployee";
import { useAuth } from "@/hooks/useAuth";
import { useAppLocale } from "@/hooks/useAppLocale";
import { fetchEffectiveCalendar } from "@/services/checkinbiz/calendar.service";

type EmployeeCalendarConfig = {
  overridesSchedule?: WeeklyScheduleWithBreaks;
  overridesDisabled?: boolean;
  advance?: {
    enableDayTimeRange?: boolean;
    disableBreak?: boolean;
    timeBreak?: number;
    notifyBeforeMinutes?: number;
    overridesDisabled?: boolean;
  };
  holidays?: Holiday[];
  timezone?: string;
  sources?: any;
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

const EmployeeCalendarDetail = ({ employee, refreshKey = 0 }: { employee: IEmployee; refreshKey?: number }) => {
  const t = useTranslations('calendar');
  const tSucursal = useTranslations('sucursal');
  const tCore = useTranslations('core.label');
  const tDays = useTranslations('core.days');
  const { currentEntity } = useEntity();
  const { changeLoaderState } = useLayout();
  const { token } = useAuth();
  const { currentLocale } = useAppLocale();
  const entityId = currentEntity?.entity?.id;
  const employeeId = employee?.id;

  const branchIds = Array.isArray(employee?.branchId) ? employee.branchId.filter(Boolean) : [];
  const [selectedBranchId, setSelectedBranchId] = useState<string | undefined>(branchIds[0]);

  const [config, setConfig] = useState<EmployeeCalendarConfig | null>(null);
  const totalWeeklyMinutes = useMemo(() => {
    if (!config?.overridesSchedule) return 0;
    let total = 0;
    const schedule = config.overridesSchedule;
    const breakMinutes = config.advance?.disableBreak && config.advance?.timeBreak ? Number(config.advance.timeBreak) : 0;
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
    dayKeys.forEach((key) => {
      const dayValue: any = (schedule as any)[key];
      if (dayValue?.enabled && Array.isArray(dayValue.shifts)) {
        dayValue.shifts.forEach((s: any) => {
          if (s?.start && s?.end) {
            const duration = (s.end.hour * 60 + s.end.minute) - (s.start.hour * 60 + s.start.minute);
            total += Math.max(0, duration - breakMinutes);
          }
        });
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
    monday: { enabled: true, disabled: false, shifts: [{ start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } }] },
    tuesday: { enabled: true, disabled: false, shifts: [{ start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } }] },
    wednesday: { enabled: true, disabled: false, shifts: [{ start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } }] },
    thursday: { enabled: true, disabled: false, shifts: [{ start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } }] },
    friday: { enabled: true, disabled: false, shifts: [{ start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } }] },
    saturday: { enabled: false, disabled: true, shifts: [{ start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } }] },
    sunday: { enabled: false, disabled: true, shifts: [{ start: { hour: 9, minute: 0 }, end: { hour: 17, minute: 0 } }] },
  };
  const fallbackAdvance = {
    enableDayTimeRange: false,
    disableBreak: false,
    timeBreak: 30,
    notifyBeforeMinutes: 15,
  };

  useEffect(() => {
    const load = async () => {
      if (!entityId || !employeeId || !token) return;
      setLoading(true);
      changeLoaderState({ show: true, args: { text: t('actions.saving') } });
      try {
        const params: any = {
          scope: 'employee',
          entityId,
          employeeId,
          token,
          locale: currentLocale,
        };
        if (selectedBranchId) params.branchId = selectedBranchId;

        const data = await fetchEffectiveCalendar(params);

        const effectiveSchedule = mapScheduleWithEnabled(data?.weeklySchedule as WeeklyScheduleWithBreaks | undefined, fallbackSchedule);
        const effectiveAdvance = data?.advance ?? fallbackAdvance;

        setConfig({
          overridesSchedule: effectiveSchedule,
          overridesDisabled: data?.advance?.overridesDisabled ?? false,
          advance: effectiveAdvance,
          holidays: Array.isArray(data?.holidays) ? data?.holidays : [],
          timezone: data?.timezone,
          sources: data?.sources,
        });
      } catch (error) {
        setConfig({
          overridesSchedule: fallbackSchedule,
          overridesDisabled: true,
          advance: fallbackAdvance,
          holidays: [],
        });
      } finally {
        setLoading(false);
        changeLoaderState({ show: false });
      }
    };
    load();
  }, [entityId, employeeId, selectedBranchId, token, currentLocale, changeLoaderState, t, refreshKey]);

  const schedule = config?.overridesSchedule ?? fallbackSchedule;
  const overridesDisabled = config?.overridesDisabled ?? false;

  const isCustom = config?.sources?.schedule === 'employee' && !config?.advance?.overridesDisabled;

  return (
    <Stack spacing={3}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
          <Stack>
            <Typography fontWeight={600}>{t('schedule.title')}</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 2 }}>
            <Chip
              color="primary"
              variant="outlined"
              label={isCustom ? t('schedule.customSchedule') : t('schedule.baseSchedule')}
              size="small"
            />
            {!isCustom && branchIds.length > 0 && (
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel>{t('core.label.branch')}</InputLabel>
                <Select
                  value={selectedBranchId ?? ''}
                  label={t('core.label.branch')}
                  onChange={(e) => setSelectedBranchId(e.target.value || undefined)}
                >
                  {branchIds.map((bId: string) => (
                    <MenuItem key={bId} value={bId}>{bId}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
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
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Chip
                    size="small"
                    color="primary"
                    label={config?.advance?.enableDayTimeRange ? t('schedule.strictRange') : 'Jornada flexible'}
                  />
                  <Typography variant="subtitle2" fontWeight={700}>{t('schedule.title')}</Typography>
                </Stack>
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
                </Stack>
              </Box>

              <Box>
                <Typography color="text.primary" fontWeight={400} sx={{ mb: 1 }}>
                  {tSucursal('scheduledDays')} ({Object.values(schedule || {}).filter((d: any) => d?.enabled).length})
                </Typography>
                <Stack spacing={1.5}>
                                    {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const)
                                        .map((dayKey) => {
                                            const dayValue: any = (schedule as any)[dayKey];
                                            if (!dayValue?.enabled) return null;
                                            const dayShifts = Array.isArray(dayValue.shifts) ? dayValue.shifts : [];
                                            const breakMinutes = config?.advance?.disableBreak && config?.advance?.timeBreak ? Number(config.advance.timeBreak) : 0;
                                            const dayTotalMinutes = dayShifts.reduce((acc: number, s: any) => {
                                                if (s?.start && s?.end) {
                                                    const duration = (s.end.hour * 60 + s.end.minute) - (s.start.hour * 60 + s.start.minute);
                                                    return acc + Math.max(0, duration - breakMinutes);
                                                }
                                                return acc;
                                            }, 0);
                                            const dayHours = Math.floor(dayTotalMinutes / 60);
                                            const dayMins = dayTotalMinutes % 60;
                                            const dayTotalLabel = `${dayHours > 0 ? `${dayHours}h ` : ''}${dayMins > 0 ? `${dayMins}m` : ''}`.trim() || '0m';

                                            return (
                                                <Box key={dayKey} position="relative" sx={{ bgcolor: 'white', borderRadius: 2, p: 1.5, boxShadow: 2 }}>
                                                    <Box
                                                        position="absolute"
                                                        right={10}
                                                        top="20%"
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: '50%',
                                                            bgcolor: (theme) => theme.palette.primary.main,
                                                            color: (theme) => theme.palette.primary.contrastText,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            boxShadow: 3,
                                                            typography: 'subtitle2',
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {dayTotalLabel}
                                                    </Box>
                                                    <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="space-between">
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Typography variant="h6" fontWeight={600}>{tDays(dayKey as any)}</Typography>
                                                            <Chip label={`${dayShifts.length} ${dayShifts.length === 1 ? tCore('shift') : tCore('shifts')}`} color="primary" variant="outlined" size="small" />
                                                        </Stack>
                                                    </Stack>
                                                    <Stack spacing={0.5} mt={1} direction="row">
                                                        {dayShifts.map((s: any, idx: number) => {
                                                            const duration = s?.start && s?.end
                                                                ? (s.end.hour * 60 + s.end.minute) - (s.start.hour * 60 + s.start.minute)
                                                                : 0;
                                                            const net = Math.max(0, duration - breakMinutes);
                                                            const h = Math.floor(net / 60);
                                                            const m = net % 60;
                                                            const durationLabel = `${h > 0 ? `${h}h ` : ''}${m > 0 ? `${m}m` : ''}`.trim() || '0m';
                                                            const startLabel = s?.start ? `${String(s.start.hour).padStart(2, '0')}:${String(s.start.minute).padStart(2, '0')}` : '--';
                                                            const endLabel = s?.end ? `${String(s.end.hour).padStart(2, '0')}:${String(s.end.minute).padStart(2, '0')}` : '--';
                                                            return (
                                                                <Stack key={`${dayKey}-${idx}`} direction="row" spacing={1.5} alignItems="center" justifyContent="space-between" flexWrap="wrap">
                                                                    <Chip
                                                                      size="medium"
                                                                      icon={<AlarmOutlined fontSize="small" />}
                                                                      label={`${startLabel} - ${endLabel}`}
                                                                      variant="outlined"
                                                                      sx={{ fontSize: 14, fontWeight: 400 }}
                                                                    />
                                                                </Stack>
                                                            );
                                                        })}
                                                    </Stack>
                                                </Box>
                                            );
                                        })}
                                </Stack>
              </Box>
            </Stack>
          )}

          <Divider sx={{ my: 2 }} />
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
          <Stack>
            <Typography fontWeight={600}>Ausencias</Typography>
            <Typography color="text.secondary" variant="body2">Ausencias registradas del empleado.</Typography>
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
                    <Typography color="text.secondary">Sin ausencias registradas.</Typography>
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

export default EmployeeCalendarDetail;
