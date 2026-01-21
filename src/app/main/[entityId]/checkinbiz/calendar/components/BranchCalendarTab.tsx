'use client';

import { useEffect, useMemo, useState } from "react";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { useAppLocale } from "@/hooks/useAppLocale";
import { useToast } from "@/hooks/useToast";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { getRefByPathData } from "@/lib/firebase/firestore/readDocument";
import { Holiday, WeeklyScheduleWithBreaks } from "@/domain/features/checkinbiz/ICalendar";
import CalendarSection from "./CalendarSection";
import { search as searchBranch } from "@/services/checkinbiz/sucursal.service";
import { Select, MenuItem, Typography, Box } from "@mui/material";

type BranchCalendarFormValues = {
    schedule: WeeklyScheduleWithBreaks;
    enableDayTimeRange: boolean;
    notifyBeforeMinutes?: number;
    disableBreak?: boolean;
    timeBreak?: number;
    branchId: string;
};

const DAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

const defaultDay = (enabled = true) => ({
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
    sunday: defaultDay(false),
});

const mapStoredSchedule = (stored?: WeeklyScheduleWithBreaks, fallback?: WeeklyScheduleWithBreaks) => {
    const base = fallback ?? buildDefaultSchedule();
    const result: WeeklyScheduleWithBreaks = {};
    DAY_KEYS.forEach((key) => {
        const storedDay = stored?.[key];
        if (storedDay) {
            result[key] = { ...storedDay, enabled: true };
        } else {
            result[key] = base[key] ?? defaultDay(false);
        }
    });
    return result;
};

const BranchCalendarTab = () => {
    const t = useTranslations('calendar');
    const { currentEntity } = useEntity();
    const { token } = useAuth();
    const { currentLocale } = useAppLocale();
    const { showToast } = useToast();
    const { changeLoaderState } = useLayout();

    const defaultInitialValues: BranchCalendarFormValues = useMemo(() => ({
        schedule: {},
        enableDayTimeRange: false,
        notifyBeforeMinutes: 15,
        disableBreak: false,
        timeBreak: 60,
        branchId: '',
    }), []);

    const [initialValues, setInitialValues] = useState<BranchCalendarFormValues>(defaultInitialValues);
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);

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

    useEffect(() => {
        const loadConfig = async (branchId: string) => {
            if (!currentEntity?.entity?.id || !branchId) return;
            changeLoaderState({ show: true });
            try {
                const entityPath = `entities/${currentEntity.entity.id}/calendar/config`;
                const entityData = await getRefByPathData(entityPath);
                const fallbackSchedule = mapStoredSchedule(entityData?.defaultSchedule as WeeklyScheduleWithBreaks | undefined, buildDefaultSchedule());
                const fallbackAdvance = entityData?.advance ?? {
                    enableDayTimeRange: false,
                    disableBreak: false,
                    timeBreak: 60,
                    notifyBeforeMinutes: 15,
                };
                const path = `entities/${currentEntity.entity.id}/branches/${branchId}/calendar/config`;
                const data = await getRefByPathData(path);
                if (data) {
                    const advance = data.advance ?? {};
                    setInitialValues({
                        schedule: mapStoredSchedule(data.overridesSchedule as WeeklyScheduleWithBreaks | undefined, fallbackSchedule),
                        enableDayTimeRange: advance.enableDayTimeRange ?? data.strictRange ?? fallbackAdvance.enableDayTimeRange ?? false,
                        notifyBeforeMinutes: advance.notifyBeforeMinutes ?? data.notifyBeforeMinutes ?? fallbackAdvance.notifyBeforeMinutes ?? 15,
                        disableBreak: advance.disableBreak ?? data.disableBreak ?? fallbackAdvance.disableBreak ?? false,
                        timeBreak: advance.timeBreak ?? data.timeBreak ?? fallbackAdvance.timeBreak ?? 60,
                        branchId,
                    });
                    if (Array.isArray(data.holidays)) {
                        setHolidays(data.holidays);
                    } else if (data.holiday) {
                        setHolidays([data.holiday]);
                    } else {
                        setHolidays([]);
                    }
                } else {
                    setInitialValues(prev => ({
                        ...prev,
                        branchId,
                        schedule: fallbackSchedule,
                        enableDayTimeRange: fallbackAdvance.enableDayTimeRange ?? false,
                        disableBreak: fallbackAdvance.disableBreak ?? false,
                        timeBreak: fallbackAdvance.timeBreak ?? 60,
                        notifyBeforeMinutes: fallbackAdvance.notifyBeforeMinutes ?? 15
                    }));
                    setHolidays([]);
                }
            } catch (error) {
                setInitialValues(prev => ({
                    ...prev,
                    branchId,
                    schedule: buildDefaultSchedule(),
                    enableDayTimeRange: false,
                    disableBreak: false,
                    timeBreak: 60,
                    notifyBeforeMinutes: 15
                }));
                setHolidays([]);
            } finally {
                changeLoaderState({ show: false });
            }
        };

        if (initialValues.branchId) {
            loadConfig(initialValues.branchId);
        }
    }, [initialValues.branchId, currentEntity?.entity?.id, changeLoaderState]);

    const handleSaved = () => showToast(t('feedback.saved'), 'success');

    return (
        <Stack spacing={3} sx={{ pb: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 320 }}>
                <Typography variant="subtitle1">{t('tabs.branch')}</Typography>
                <Select
                    displayEmpty
                    value={initialValues.branchId}
                    onChange={(e) => setInitialValues(prev => ({ ...prev, branchId: e.target.value as string }))}
                >
                    <MenuItem value="">{t('tabs.branch')}</MenuItem>
                    {branches.map((b) => (
                        <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                    ))}
                </Select>
            </Box>

            {initialValues.branchId && (
                <CalendarSection
                    scope="branch"
                    entityId={currentEntity?.entity?.id as string}
                    branchId={initialValues.branchId}
                    timezone={currentEntity?.entity?.legal?.address?.timeZone ?? "UTC"}
                    token={token as string}
                    locale={currentLocale}
                    initialSchedule={initialValues.schedule}
                    initialAdvance={{
                        enableDayTimeRange: initialValues.enableDayTimeRange,
                        disableBreak: initialValues.disableBreak,
                        timeBreak: initialValues.timeBreak,
                        notifyBeforeMinutes: initialValues.notifyBeforeMinutes,
                    }}
                    initialHolidays={holidays}
                    onSaved={handleSaved}
                />
            )}
        </Stack>
    );
};

export default BranchCalendarTab;
