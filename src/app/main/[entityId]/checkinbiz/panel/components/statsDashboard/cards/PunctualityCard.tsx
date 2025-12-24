'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslations } from "next-intl";
import React from "react";
import { StatCard } from "../StatCard";
import { alignSeriesByDate, defaultLabelFromKey, defaultTooltipProps, formatKpiEntries, formatPercent, hashBranchColor, normalizeSeriesNumbers } from "../chartUtils";
import { BranchSeries, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";

export const PunctualityCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
  const t = useTranslations("statsDashboard");
  const tp = useTranslations("statsDashboard.punctuality");
  const kpiLabel = (key: string) => {
    try {
      return t(`kpiLabels.${key}` as any);
    } catch {
      return defaultLabelFromKey(key);
    }
  };
  const { data, isLoading, error } = useCheckbizStats<BranchSeries[]>({
    entityId,
    branchId,
    from,
    to,
    metric: "punctuality",
    granularity: "daily",
  });

  const mappedSeries: BranchSeries[] =
    data?.dataset?.map((branch) => ({
      ...branch,
      points: branch.points.map((p) => ({
        ...p,
        onTimeRateIn: p.onTimeRateIn ?? p.onTimeRate ?? null,
        onTimeRateOut: p.onTimeRateOut ?? null,
        avgLateMinutesIn: p.avgLateMinutesIn ?? p.avgLateMinutes ?? null,
        avgLateMinutesOut: p.avgLateMinutesOut ?? null,
      })),
    })) ?? [];

  const series = alignSeriesByDate(
    normalizeSeriesNumbers(mappedSeries, [
      "onTimeRateIn",
      "onTimeRateOut",
      "avgLateMinutesIn",
      "avgLateMinutesOut",
    ]),
    ["onTimeRateIn", "onTimeRateOut", "avgLateMinutesIn", "avgLateMinutesOut"],
    null,
  );
  const punctualityKpis =
    data?.kpis
      ? Object.entries(data.kpis).map(([key, value]) => {
        const label = kpiLabel(key);
        if (value === null || value === undefined || Number.isNaN(Number(value))) {
          return { label, value: "-" };
        }
        const num = Number(value);
        const lower = key.toLowerCase();
        if (lower.includes("rate")) {
          return { label: `${label} (%)`, value: `${(num * 100).toFixed(1)}%` };
        }
        if (lower.includes("late") || lower.includes("minutes")) {
          return { label, value: `${num.toFixed(1)} ${tp("minutes")}` };
        }
        return { label, value: num.toFixed(2) };
      })
      : [];

  return (
    <StatCard
      title={t("punctuality.title")}
      subtitle={`${t("punctuality.subtitle")} (${tp("onTimeLabel")} = proporción → % en UI)`}
      isLoading={isLoading}
      error={error}
      kpis={punctualityKpis}
      infoText={t("descriptions.punctuality")}
    >
      <ResponsiveContainer width="100%" height={320}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
          <YAxis
            tickFormatter={(v) => formatPercent(Number(v))}
            domain={[0, "dataMax"]}
          />
          <Tooltip
            {...defaultTooltipProps}
            formatter={(value: number, name: string, item) => {
              const dataKey = (item as any)?.dataKey?.toString() ?? "";
              const lower = dataKey.toLowerCase();
              const formattedValue = lower.includes("minutes")
                ? `${Number(value).toFixed(1)} ${tp("minutes")}`
                : `${(Number(value) * 100).toFixed(1)}%`;
              const fallbackLabel = lower.includes("out")
                ? `${tp("onTimeLabel")} (out)`
                : `${tp("onTimeLabel")} (in)`;
              return [formattedValue, name || fallbackLabel];
            }}
            labelFormatter={(label) => `${tp("date")}: ${label}`}
          />
          <Legend />
          {series.map((branch) => {
            const label = branch.branchName ?? branch.branchId;
            const hasIn = branch.points.some(
              (p) => p.onTimeRateIn !== null && p.onTimeRateIn !== undefined,
            );
            const hasOut = branch.points.some(
              (p) => p.onTimeRateOut !== null && p.onTimeRateOut !== undefined,
            );
            return (
              <React.Fragment key={branch.branchId}>
                {hasIn && (
                  <Line
                    type="monotone"
                    data={branch.points}
                    dataKey="onTimeRateIn"
                    name={`${label} · ${tp("onTimeLabel")} (in)`}
                    stroke={hashBranchColor(branch.branchId)}
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                )}
                {hasOut && (
                  <Line
                    type="monotone"
                    data={branch.points}
                    dataKey="onTimeRateOut"
                    name={`${label} · ${tp("onTimeLabel")} (out)`}
                    stroke={hashBranchColor(`${branch.branchId}-out`)}
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                )}
              </React.Fragment>
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
