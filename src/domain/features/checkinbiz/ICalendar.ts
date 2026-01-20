export type CalendarScope = "entity" | "branch" | "employee";

export type TimeValue = {
    hour: number;
    minute: number;
};

export type DayBreak = {
    start: TimeValue;
    end: TimeValue;
    id?: string;
};

export type DayScheduleWithBreaks = {
    enabled?: boolean; // UI only - removed when sending to API
    start?: TimeValue;
    end?: TimeValue;
    breaks?: DayBreak[];
    strictRange?: boolean;
    toleranceMinutes?: number;
};

export type WeeklyScheduleWithBreaks = {
    monday?: DayScheduleWithBreaks;
    tuesday?: DayScheduleWithBreaks;
    wednesday?: DayScheduleWithBreaks;
    thursday?: DayScheduleWithBreaks;
    friday?: DayScheduleWithBreaks;
    saturday?: DayScheduleWithBreaks;
    sunday?: DayScheduleWithBreaks;
};

export type AdvanceSchedulePayload = {
    enableDayTimeRange?: boolean;
    disableBreak?: boolean;
    timeBreak?: number;
    notifyBeforeMinutes?: number;
};

export type Holiday = {
    id: string;
    name: string;
    date: string;
    description?: string;
};

export type Absence = {
    id: string;
    startDate: string;
    endDate: string;
    status: "active" | "inactive" | "vacation" | "sick_leave" | "leave_of_absence" | "paternity_leave" | "maternity_leave";
    note?: string;
};

export type CalendarUpsertPayload = {
    scope: CalendarScope;
    entityId: string;
    branchId?: string;
    employeeId?: string;
    timezone?: string;
    defaultSchedule?: WeeklyScheduleWithBreaks;
    overridesSchedule?: WeeklyScheduleWithBreaks;
    holiday?: Holiday;
    absence?: Absence;
    advance?: AdvanceSchedulePayload;
};

export type CalendarDeletePayload = {
    scope: CalendarScope;
    kind: "holiday" | "absence";
    entityId: string;
    branchId?: string;
    employeeId?: string;
    id: string;
};
