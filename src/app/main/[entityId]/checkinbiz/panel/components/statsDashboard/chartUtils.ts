'use client';

import { BranchSeries, BranchSeriesPoint } from "../hooks/useCheckbizStats";
export const formatCurrency = (value?: number) => {
  if (value === undefined || Number.isNaN(value)) return "-";
  return `¤ ${value.toFixed(2)}`;
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

export const defaultTooltipProps = {
  wrapperStyle: { overflow: "visible", zIndex: 10 },
  contentStyle: {
    backgroundColor: "#fff",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    padding: "10px 12px",
  },
  labelStyle: { fontWeight: 600, color: "#111", marginBottom: 4 },
  itemStyle: { padding: 0 },
} as const;

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

export const defaultLabelFromKey = (key: string) => key.replace(/([A-Z])/g, " $1").trim();

export const formatKpiEntries = (
  kpis?: Record<string, number | string | null>,
  translateLabel?: (key: string) => string,
) => {
  if (!kpis) return [];
  const entries = Object.entries(kpis);
  const hidden = new Set(["avgcostperemployee"]);
  return entries
    .filter(([key]) => !hidden.has(key.toLowerCase()))
    .map(([key, value]) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return { label: translateLabel ? translateLabel(key) : defaultLabelFromKey(key), value: "-" };
    }
    const lower = key.toLowerCase();
    const label = translateLabel ? translateLabel(key) : defaultLabelFromKey(key);
    const num = Number(value);
    if (lower.includes("cost") || lower.includes("budget")) {
      return { label, value: formatCurrency(num) };
    }
    if (lower.includes("hour")) {
      return { label, value: formatHours(num) };
    }
    if (lower.includes("rate") || lower.includes("pct") || lower.includes("percent")) {
      return { label, value: formatPercent(num, false) };
    }
    return { label, value: formatNumber(num, 2) };
  });
};

export const sortPointsByDate = (points: BranchSeriesPoint[]) =>
  [...points].sort((a, b) => `${a.date}`.localeCompare(`${b.date}`));

export const alignSeriesByDate = <T extends BranchSeries>(
  series: T[],
  numericKeys: (keyof BranchSeriesPoint)[],
  fillValue: number | null = null,
): T[] => {
  const dates = Array.from(
    new Set<string>(series.flatMap((branch) => branch.points.map((p) => p.date))),
  ).sort((a, b) => `${a}`.localeCompare(`${b}`));

  return series.map((branch) => {
    const pointMap = new Map(branch.points.map((p) => [p.date, p]));
    const alignedPoints = dates.map((date) => {
      const existing = pointMap.get(date);
      if (existing) return existing;
      const filler = { date } as BranchSeriesPoint;
      numericKeys.forEach((key) => {
        (filler as any)[key] = fillValue as number | null;
      });
      return filler;
    });
    return { ...branch, points: alignedPoints } as T;
  });
};

export const normalizeSeriesNumbers = <T extends BranchSeries>(
  series: T[],
  numericKeys: (keyof BranchSeriesPoint)[],
): T[] =>
  series.map((branch) => ({
    ...branch,
    points: sortPointsByDate(branch.points).map((p) => {
      const next: Record<string, unknown> = { ...p };
      numericKeys.forEach((key) => {
        if (next[key] !== undefined && next[key] !== null) {
          const num = Number(next[key]);
          next[key] = Number.isNaN(num) ? next[key] : num;
        }
      });
      return next as unknown as BranchSeriesPoint;
    }),
  }));
