'use client';

import { useEffect, useMemo, useState } from "react";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { Holiday, WeeklyScheduleWithBreaks } from "@/domain/features/checkinbiz/ICalendar";
import { useEntity } from "@/hooks/useEntity";
import { useAuth } from "@/hooks/useAuth";
import { useAppLocale } from "@/hooks/useAppLocale";
import { useToast } from "@/hooks/useToast";
import { getRefByPathData } from "@/lib/firebase/firestore/readDocument";
import CalendarSection from "./CalendarSection";

type AdvanceConfig = {
  enableDayTimeRange?: boolean;
  disableBreak?: boolean;
  timeBreak?: number;
  notifyBeforeMinutes?: number;
};

const DAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

const defaultDay = (enabled = true) => ({
  enabled,
  disabled: !enabled,
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
  sunday: defaultDay(false),
});

const mapStoredSchedule = (stored?: WeeklyScheduleWithBreaks, fallback?: WeeklyScheduleWithBreaks) => {
  const base = fallback ?? buildDefaultSchedule();
  const result: WeeklyScheduleWithBreaks = {};
  DAY_KEYS.forEach((key) => {
    const storedDay = stored?.[key];
    if (storedDay) {
      const enabled = storedDay.disabled ? false : storedDay.enabled ?? true;
      result[key] = { ...storedDay, enabled, disabled: storedDay.disabled ?? !enabled };
    } else {
      result[key] = base[key] ?? defaultDay(false);
    }
  });
  return result;
};

const fallbackAdvance: AdvanceConfig = {
  enableDayTimeRange: false,
  disableBreak: false,
  timeBreak: 60,
  notifyBeforeMinutes: 15,
};

const EntityCalendarTab = () => {
  const t = useTranslations("calendar");
  const { currentEntity } = useEntity();
  const { token } = useAuth();
  const { currentLocale } = useAppLocale();
  const { showToast } = useToast();

  const [schedule, setSchedule] = useState<WeeklyScheduleWithBreaks>(buildDefaultSchedule());
  const [advance, setAdvance] = useState<AdvanceConfig>(fallbackAdvance);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);

  const entityId = currentEntity?.entity?.id;
  const entityTimezone = currentEntity?.entity?.legal?.address?.timeZone ?? "UTC";

  const handleSaved = () => showToast(t("feedback.saved"), "success");

  useEffect(() => {
    const loadConfig = async () => {
      if (!entityId) return;
      setLoading(true);
      try {
        const data = await getRefByPathData(`entities/${entityId}/calendar/config`);
        if (data) {
          const mappedSchedule = mapStoredSchedule(data.defaultSchedule as WeeklyScheduleWithBreaks | undefined);
          const storedAdvance: AdvanceConfig = {
            enableDayTimeRange: data.advance?.enableDayTimeRange ?? data.strictRange ?? fallbackAdvance.enableDayTimeRange,
            disableBreak: data.advance?.disableBreak ?? data.disableBreak ?? fallbackAdvance.disableBreak,
            timeBreak: data.advance?.timeBreak ?? data.timeBreak ?? fallbackAdvance.timeBreak,
            notifyBeforeMinutes: data.advance?.notifyBeforeMinutes ?? data.notifyBeforeMinutes ?? fallbackAdvance.notifyBeforeMinutes,
          };
          setSchedule(mappedSchedule);
          setAdvance(storedAdvance);
          if (Array.isArray(data.holidays)) {
            setHolidays(data.holidays);
          } else if (data.holiday) {
            setHolidays([data.holiday]);
          } else {
            setHolidays([]);
          }
        } else {
          setSchedule(buildDefaultSchedule());
          setAdvance(fallbackAdvance);
          setHolidays([]);
        }
      } catch (error) {
        setSchedule(buildDefaultSchedule());
        setAdvance(fallbackAdvance);
        setHolidays([]);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [entityId]);

  const initialAdvance = useMemo(() => advance, [advance]);

  return (
    <Stack spacing={3} sx={{ pb: 6 }}>
      {!loading && (
        <CalendarSection
          scope="entity"
          entityId={entityId as string}
          timezone={entityTimezone}
          token={token as string}
          locale={currentLocale}
          initialSchedule={schedule}
          initialAdvance={initialAdvance}
          initialHolidays={holidays}
          onSaved={handleSaved}
        />
      )}
    </Stack>
  );
};

export default EntityCalendarTab;
