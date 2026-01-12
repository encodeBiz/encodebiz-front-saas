'use client';

import { useEffect, useMemo, useState } from "react";

export type CheckbizGranularity = "daily" | "total" | "weekly" | "hourly";

export interface CheckbizStatsParams {
  entityId: string;
  branchId?: string;
  from: string;
  to: string;
  metric:
    | "cost_by_branch"
    | "hours_by_branch"
    | "cost_per_hour"
    | "cost_distribution"
    | "cost_vs_budget"
    | "suspect_rates"
    | "start_end_times"
    | "distance_avg"
    | "geo_compliance"
    | "absenteeism"
    | "punctuality"
    | "extra_hours"
    | "shift_compliance"
    | "weekly_trends"
    | "employee_productivity"
    | "top_employees"
    | "branch_ranking"
    | "hourly_distribution"
    | "salary_estimate"
    | "kpis";
  granularity?: CheckbizGranularity;
  topN?: number;
  budgets?: unknown;
  expectedStartHour?: number;
  toleranceMinutes?: number;
  expectedHoursPerDay?: number;
  distanceThresholdMeters?: number;
}

export interface BranchSeriesPoint {
  date: string;
  totalCost?: number;
  workedHours?: number;
  costPerHour?: number;
  suspects?: number;
  failed?: number;
  valid?: number;
  suspectRate?: number | null;
  failureRate?: number | null;
  onTimeRate?: number | null;
  avgLateMinutes?: number | null;
  onTimeRateIn?: number | null;
  onTimeRateOut?: number | null;
  avgLateMinutesIn?: number | null;
  avgLateMinutesOut?: number | null;
  avgStart?: number;
  avgEnd?: number;
  budget?: number;
  variancePct?: number;
  expectedHours?: number;
  extraHours?: number;
  deficitHours?: number;
  complianceRate?: number;
  avgDistance?: number | null;
  withinRate?: number | null;
  expectedHoursPerDay?: number;
}

export interface BranchSeries {
  branchId: string;
  branchName?: string;
  points: BranchSeriesPoint[];
  employeesCount?: number;
  threshold?: number;
}

export interface BranchAggregate {
  branchId: string;
  branchName?: string;
  totalCost?: number;
  workedHours?: number;
  costPerHour?: number;
  suspects?: number;
  failed?: number;
  valid?: number;
  suspectRate?: number;
  activeDays?: number;
  inactiveDays?: number;
  activityRate?: number;
  complianceRate?: number;
  budget?: number;
  variancePct?: number;
  withinRate?: number;
  avgDistance?: number;
  score?: number;
}

export interface WeeklyTrend {
  week: string;
  cost?: number;
  hours?: number;
  suspects?: number;
  branches?: {
    branchId: string;
    branchName?: string;
    cost?: number;
    hours?: number;
    suspects?: number;
  }[];
}

export interface RankingItem {
  branchId?: string;
  branchName?: string;
  employeeId?: string;
  costPerHour?: number;
  cost?: number;
  hours?: number;
  score?: number;
  suspectRate?: number;
  complianceRate?: number;
}

export interface HourlyDistribution {
  branchId: string;
  branchName?: string;
  daysCount?: number;
  hours: {
    hour: number;
    coverage?: number;
    starts?: number;
    ends?: number;
    avgEmployees?: number;
    startsPerDay?: number;
    endsPerDay?: number;
  }[];
  threshold?: number;
}

export interface KpisDataset {
  totalCost?: number;
  avgCostPerBranch?: number;
  avgCostPerEmployee?: number;
  totalHours?: number;
  activityRate?: number;
}

interface CheckbizStatsResponse<T> {
  dataset: T;
  kpis?: Record<string, number>;
}

export function useCheckbizStats<T = unknown>(
  params: CheckbizStatsParams | null,
): { data: CheckbizStatsResponse<T> | null; isLoading: boolean; error: Error | null } {
  const [data, setData] = useState<CheckbizStatsResponse<T> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const paramsJson = useMemo(() => (params ? JSON.stringify(params) : ""), [params]);

  useEffect(() => {
    if (!paramsJson) return;
    const controller = new AbortController();
    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch( process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_STATS_PANEL as string, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: paramsJson,
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const json = (await res.json()) as CheckbizStatsResponse<T>;
        if (!controller.signal.aborted) {
          setData(json);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err as Error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };
    run();
    return () => controller.abort();
  }, [paramsJson]);

  return { data, isLoading, error };
}
