import { IChecklog } from "@/domain/features/checkinbiz/IChecklog";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export type WorkSessionStatus =
  | "pending"
  | "incident"
  | "on_break"
  | "working"
  | "completed";

export interface WorkSessionIncident {
  code:
    | "failed_log"
    | "missing_checkin"
    | "open_break"
    | "invalid_sequence"
    | "multiple_checkouts"
    | "cross_branch_session"
    | "incomplete_workday";
  severity: "low" | "medium" | "high";
  relatedLogIds?: string[];
}

export interface WorkSessionBreakSegment {
  restIn?: IChecklog;
  restOut?: IChecklog;
  durationMinutes?: number;
  status: "completed" | "open" | "invalid";
}

export interface WorkSessionSummary {
  sessionKey: string;
  employeeId: string;
  employeeName: string;
  branchId?: string;
  branchName?: string;
  dateKey: string;
  status: WorkSessionStatus;
  openingLog?: IChecklog;
  closingLog?: IChecklog;
  lastMovement?: IChecklog;
  breakSegments: WorkSessionBreakSegment[];
  workedMinutes: number;
  breakMinutes: number;
  incidents: WorkSessionIncident[];
  logs: IChecklog[];
}

const getJsDate = (value: IChecklog["timestamp"]): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "object" && value?.seconds) {
    return new Date(value.seconds * 1000 + (value.nanoseconds ?? 0) / 1_000_000);
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

const getTime = (value: IChecklog["timestamp"]): number => {
  return getJsDate(value)?.getTime() ?? 0;
};

const minutesBetweenMs = (startTime: number, endTime: number): number => {
  if (!startTime || !endTime || endTime <= startTime) return 0;
  return Math.round((endTime - startTime) / 60000);
};

const minutesBetween = (start?: IChecklog, end?: IChecklog): number => {
  return minutesBetweenMs(start ? getTime(start.timestamp) : 0, end ? getTime(end.timestamp) : 0);
};

const getLogTimezone = (log?: IChecklog) => log?.branch?.address?.timeZone ?? log?.metadata?.tz ?? log?.metadata?.etz ?? "UTC";

const dayKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

const getScheduleApplied = (log?: IChecklog) => {
  if (!log) return null;
  if (log.metadata?.scheduleApplied?.start && log.metadata?.scheduleApplied?.end) {
    return log.metadata.scheduleApplied;
  }

  const tz = getLogTimezone(log);
  const date = getJsDate(log.timestamp);
  const dayKey = date ? dayKeys[Number(dayjs(date).tz(tz).format("d"))] : undefined;
  const responsibilitySchedule = dayKey ? log.metadata?.employeeResponsibility?.workSchedule?.[dayKey] : null;
  if (responsibilitySchedule?.start && responsibilitySchedule?.end) return responsibilitySchedule;

  const branchSchedule = dayKey ? log.branch?.advance?.workSchedule?.[dayKey] : null;
  if (branchSchedule?.start && branchSchedule?.end) return branchSchedule;

  if (log.branch?.advance?.startTimeWorkingDay && log.branch?.advance?.endTimeWorkingDay) {
    return {
      start: log.branch.advance.startTimeWorkingDay,
      end: log.branch.advance.endTimeWorkingDay,
    };
  }

  return null;
};

const getStrictScheduleEnabled = (logs: IChecklog[]) =>
  logs.some((log) =>
    log.metadata?.enableDayTimeRange === true ||
    log.branch?.advance?.enableDayTimeRange === true
  );

const getStrictBreakConfig = (logs: IChecklog[]) => {
  const source = logs.find((log) =>
    log.metadata?.disableBreak !== undefined ||
    log.metadata?.timeBreak !== undefined ||
    log.branch?.advance?.disableBreak !== undefined ||
    log.branch?.advance?.timeBreak !== undefined
  );

  const strictBreak = source?.metadata?.disableBreak ?? source?.branch?.advance?.disableBreak ?? false;
  const breakMinutes = Number(source?.metadata?.timeBreak ?? source?.branch?.advance?.timeBreak ?? 0);

  return {
    strictBreak: Boolean(strictBreak),
    breakMinutes: Number.isFinite(breakMinutes) && breakMinutes > 0 ? breakMinutes : 0,
  };
};

const buildScheduleBounds = (referenceLog: IChecklog, schedule: any) => {
  const date = getJsDate(referenceLog.timestamp);
  if (!date || !schedule?.start || !schedule?.end) return null;

  const tz = getLogTimezone(referenceLog);
  const day = dayjs(date).tz(tz).format("YYYY-MM-DD");
  const start = dayjs.tz(
    `${day} ${String(schedule.start.hour ?? 0).padStart(2, "0")}:${String(schedule.start.minute ?? 0).padStart(2, "0")}`,
    "YYYY-MM-DD HH:mm",
    tz
  );
  let end = dayjs.tz(
    `${day} ${String(schedule.end.hour ?? 0).padStart(2, "0")}:${String(schedule.end.minute ?? 0).padStart(2, "0")}`,
    "YYYY-MM-DD HH:mm",
    tz
  );

  if (end.valueOf() <= start.valueOf()) end = end.add(1, "day");
  return { startMs: start.valueOf(), endMs: end.valueOf() };
};

const calculateWorkedMinutes = ({
  openingLog,
  closingLog,
  lastMovement,
  breakMinutes,
  strictSchedule,
  scheduleApplied,
}: {
  openingLog?: IChecklog;
  closingLog?: IChecklog;
  lastMovement?: IChecklog;
  breakMinutes: number;
  strictSchedule: boolean;
  scheduleApplied: any;
}) => {
  if (!openingLog) return 0;

  const endLog = closingLog ?? lastMovement;
  let startMs = getTime(openingLog.timestamp);
  let endMs = endLog ? getTime(endLog.timestamp) : 0;

  if (strictSchedule && scheduleApplied) {
    const bounds = buildScheduleBounds(openingLog, scheduleApplied);
    if (bounds) {
      startMs = Math.max(startMs, bounds.startMs);
      endMs = Math.min(endMs, bounds.endMs);
    }
  }

  return Math.max(0, minutesBetweenMs(startMs, endMs) - breakMinutes);
};

const pushIncident = (
  incidents: WorkSessionIncident[],
  incident: WorkSessionIncident
) => {
  if (incident.code === "incomplete_workday") {
    if (!incidents.some((item) => item.code === incident.code)) incidents.push(incident);
    return;
  }

  const duplicate = incidents.find(
    (item) => item.code === incident.code && JSON.stringify(item.relatedLogIds ?? []) === JSON.stringify(incident.relatedLogIds ?? [])
  );
  if (!duplicate) incidents.push(incident);
};

export const buildWorkSessionSummaries = (logs: IChecklog[]): WorkSessionSummary[] => {
  const grouped = new Map<string, IChecklog[]>();

  logs.forEach((log) => {
    const sessionRef = log.checkin || (log.type === "checkin" ? log.id : undefined);
    if (!sessionRef) return;

    const key = `${log.employeeId}::${sessionRef}`;
    const current = grouped.get(key) ?? [];
    current.push(log);
    grouped.set(key, current);
  });

  return Array.from(grouped.entries())
    .map(([sessionKey, sessionLogs]) => {
      const sortedLogs = [...sessionLogs].sort((a, b) => getTime(a.timestamp) - getTime(b.timestamp));
      const incidents: WorkSessionIncident[] = [];
      const openingLog = sortedLogs.find((log) => log.type === "checkin" && log.status === "valid")
        ?? sortedLogs.find((log) => log.type === "checkin");
      const checkoutLogs = sortedLogs.filter((log) => log.type === "checkout");
      const validCheckoutLogs = checkoutLogs.filter((log) => log.status === "valid");
      const closingLog = validCheckoutLogs.length > 0
        ? validCheckoutLogs[validCheckoutLogs.length - 1]
        : checkoutLogs[checkoutLogs.length - 1];
      const lastMovement = sortedLogs[sortedLogs.length - 1];
      const branchIds = Array.from(new Set(sortedLogs.map((log) => log.branchId).filter(Boolean)));

      if (!openingLog) {
        pushIncident(incidents, { code: "missing_checkin", severity: "high" });
      }

      if (checkoutLogs.length > 1) {
        pushIncident(incidents, {
          code: "multiple_checkouts",
          severity: "medium",
          relatedLogIds: checkoutLogs.map((log) => log.id).filter(Boolean) as string[],
        });
      }

      if (branchIds.length > 1) {
        pushIncident(incidents, { code: "cross_branch_session", severity: "medium" });
      }

      const breakSegments: WorkSessionBreakSegment[] = [];
      let openBreak: IChecklog | undefined;

      sortedLogs.forEach((log) => {
        if (log.status === "failed") {
          pushIncident(incidents, {
            code: "failed_log",
            severity: "high",
            relatedLogIds: log.id ? [log.id] : undefined,
          });
        }

        if (log.status === "incomplete_workday") {
          pushIncident(incidents, {
            code: "incomplete_workday",
            severity: "high",
            relatedLogIds: log.id ? [log.id] : undefined,
          });
        }

        if (log.type === "restin") {
          if (openBreak) {
            breakSegments.push({ restIn: openBreak, status: "invalid" });
            pushIncident(incidents, {
              code: "invalid_sequence",
              severity: "medium",
              relatedLogIds: [openBreak.id, log.id].filter(Boolean) as string[],
            });
          }
          openBreak = log;
        }

        if (log.type === "restout") {
          if (!openBreak) {
            breakSegments.push({ restOut: log, status: "invalid" });
            pushIncident(incidents, {
              code: "invalid_sequence",
              severity: "medium",
              relatedLogIds: log.id ? [log.id] : undefined,
            });
            return;
          }

          breakSegments.push({
            restIn: openBreak,
            restOut: log,
            durationMinutes: minutesBetween(openBreak, log),
            status: "completed",
          });
          openBreak = undefined;
        }
      });

      if (openBreak) {
        breakSegments.push({ restIn: openBreak, status: "open" });
        pushIncident(incidents, {
          code: "open_break",
          severity: "medium",
          relatedLogIds: openBreak.id ? [openBreak.id] : undefined,
        });
      }

      const strictSchedule = getStrictScheduleEnabled(sortedLogs);
      const scheduleApplied = getScheduleApplied(openingLog) ?? getScheduleApplied(closingLog) ?? getScheduleApplied(lastMovement);
      const strictBreakConfig = getStrictBreakConfig(sortedLogs);
      const realBreakMinutes = breakSegments.reduce((total, segment) => total + (segment.durationMinutes ?? 0), 0);
      const breakMinutes = strictBreakConfig.strictBreak ? strictBreakConfig.breakMinutes : realBreakMinutes;
      const workedMinutes = calculateWorkedMinutes({
        openingLog,
        closingLog,
        lastMovement,
        breakMinutes,
        strictSchedule,
        scheduleApplied,
      });

      const hasPending = sortedLogs.some((log) => log.status === "pending-employee-validation");
      const hasIncident = incidents.length > 0;
      const hasOpenBreak = breakSegments.some((segment) => segment.status === "open");
      const isCompleted = Boolean(
        openingLog?.status === "valid" &&
        closingLog?.status === "valid"
      );

      let status: WorkSessionStatus = "working";
      if (hasPending) status = "pending";
      else if (hasOpenBreak) status = "on_break";
      else if (isCompleted) status = "completed";
      else if (hasIncident) status = "incident";

      return {
        sessionKey,
        employeeId: sortedLogs[0]?.employeeId,
        employeeName: sortedLogs[0]?.employee?.fullName ?? "Supervisor",
        branchId: branchIds.length === 1 ? branchIds[0] : undefined,
        branchName:
          branchIds.length === 1
            ? sortedLogs.find((log) => log.branch?.name)?.branch?.name
            : undefined,
        dateKey: getJsDate(openingLog?.timestamp ?? lastMovement?.timestamp)?.toISOString().slice(0, 10) ?? "",
        status,
        openingLog,
        closingLog,
        lastMovement,
        breakSegments,
        workedMinutes,
        breakMinutes,
        incidents,
        logs: sortedLogs,
      };
    })
    .sort((a, b) => getTime(b.openingLog?.timestamp ?? b.lastMovement?.timestamp) - getTime(a.openingLog?.timestamp ?? a.lastMovement?.timestamp));
};

export const formatMinutesAsHours = (minutes?: number): string => {
  const safeMinutes = Math.max(0, minutes ?? 0);
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${remainingMinutes.toString().padStart(2, "0")}`;
};
