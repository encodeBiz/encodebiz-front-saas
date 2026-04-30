import { IChecklog } from "@/domain/features/checkinbiz/IChecklog";

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

const minutesBetween = (start?: IChecklog, end?: IChecklog): number => {
  const startTime = start ? getTime(start.timestamp) : 0;
  const endTime = end ? getTime(end.timestamp) : 0;
  if (!startTime || !endTime || endTime <= startTime) return 0;
  return Math.round((endTime - startTime) / 60000);
};

const pushIncident = (
  incidents: WorkSessionIncident[],
  incident: WorkSessionIncident
) => {
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
      const openingLog = sortedLogs.find((log) => log.type === "checkin");
      const checkoutLogs = sortedLogs.filter((log) => log.type === "checkout");
      const closingLog = checkoutLogs.length > 0 ? checkoutLogs[checkoutLogs.length - 1] : undefined;
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

      const breakMinutes = breakSegments.reduce((total, segment) => total + (segment.durationMinutes ?? 0), 0);
      const workedMinutes = openingLog
        ? Math.max(0, minutesBetween(openingLog, closingLog ?? lastMovement) - breakMinutes)
        : 0;

      const hasPending = sortedLogs.some((log) => log.status === "pending-employee-validation");
      const hasIncident = incidents.length > 0;
      const hasOpenBreak = breakSegments.some((segment) => segment.status === "open");
      const isCompleted = Boolean(openingLog && closingLog);

      let status: WorkSessionStatus = "working";
      if (hasPending) status = "pending";
      else if (hasIncident) status = "incident";
      else if (hasOpenBreak) status = "on_break";
      else if (isCompleted) status = "completed";

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
