'use client';

import { BranchSeries, BranchSeriesPoint } from "../hooks/useCheckbizStats";

export const formatCurrency = (value?: number) => {
  if (value === undefined || Number.isNaN(value)) return "-";
  return `${value.toFixed(0)} $`;
};

export const formatHours = (value?: number) => {
  if (value === undefined || Number.isNaN(value)) return "-";
  return `${value.toFixed(1)} h`;
};

export const formatPercent = (value?: number, fractionToPercent = true) => {
  if (value === undefined || Number.isNaN(value)) return "-";
  const base = fractionToPercent && Math.abs(value) <= 1 ? value * 100 : value;
  return `${base.toFixed(1)}%`;
};

export const formatNumber = (value?: number | null, digits = 1) => {
  const numeric = typeof value === "string" ? Number(value) : value;
  if (numeric === undefined || numeric === null || Number.isNaN(numeric)) return "-";
  if (!Number.isFinite(numeric)) return "-";
  return numeric.toFixed(digits);
};

export const hashBranchColor = (branchId: string, alpha = 1) => {
  let hash = 0;
  for (let i = 0; i < branchId.length; i += 1) {
    hash = branchId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsla(${hue}, 65%, 55%, ${alpha})`;
};

export const mergeBranchSeries = (
  series: BranchSeries[],
  valueKey: keyof BranchSeriesPoint,
) => {
  const map = new Map<string, Record<string, number | string>>();
  series.forEach((branch) => {
    branch.points.forEach((point) => {
      const record = map.get(point.date) ?? { date: point.date };
      if (point[valueKey] !== undefined) {
        record[branch.branchId] = point[valueKey] as number;
      }
      map.set(point.date, record);
    });
  });
  return Array.from(map.values()).sort((a, b) => `${a.date}`.localeCompare(`${b.date}`));
};

export const formatKpiEntries = (kpis?: Record<string, number | string | null>) => {
  if (!kpis) return [];
  const entries = Object.entries(kpis);
  return entries.map(([key, value]) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return { label: key.replace(/([A-Z])/g, " $1").trim(), value: "-" };
    }
    const lower = key.toLowerCase();
    const label = key.replace(/([A-Z])/g, " $1").trim();
    if (lower.includes("cost") || lower.includes("budget")) {
      return { label, value: formatCurrency(value) };
    }
    if (lower.includes("hour")) {
      return { label, value: formatHours(value) };
    }
    if (lower.includes("rate") || lower.includes("pct") || lower.includes("percent")) {
      return { label, value: formatPercent(value, false) };
    }
    return { label, value: formatNumber(value, 2) };
  });
};

export const normalizeSeriesNumbers = <T extends BranchSeries>(
  series: T[],
  numericKeys: (keyof BranchSeriesPoint)[],
): T[] =>
  series.map((branch) => ({
    ...branch,
    points: branch.points.map((p) => {
      const next: Record<string, unknown> = { ...p };
      numericKeys.forEach((key) => {
        if (next[key] !== undefined && next[key] !== null) {
          const num = Number(next[key]);
          next[key] = Number.isNaN(num) ? next[key] : num;
        }
      });
      return next as BranchSeriesPoint;
    }),
  }));
