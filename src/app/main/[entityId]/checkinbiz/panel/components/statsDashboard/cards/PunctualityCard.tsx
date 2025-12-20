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
import { defaultLabelFromKey, defaultTooltipProps, formatKpiEntries, formatPercent, hashBranchColor, normalizeSeriesNumbers } from "../chartUtils";
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

  const series = normalizeSeriesNumbers(data?.dataset ?? [], ["onTimeRate", "avgLateMinutes"]);
  const onTimeAverage =
    series.reduce(
      (acc, branch) => acc + branch.points.reduce((sum, p) => sum + (p.onTimeRate ?? 0), 0),
      0,
    ) /
    (series.reduce((acc, branch) => acc + branch.points.length, 0) || 1);

  const lateAverage =
    series.reduce(
      (acc, branch) => acc + branch.points.reduce((sum, p) => sum + (p.avgLateMinutes ?? 0), 0),
      0,
    ) /
    (series.reduce((acc, branch) => acc + branch.points.length, 0) || 1);
  const apiKpis = formatKpiEntries(data?.kpis, kpiLabel);

  return (
    <StatCard
      title={t("punctuality.title")}
      subtitle={t("punctuality.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={[
        ...apiKpis,
        { label: tp("avgOnTimeRate"), value: formatPercent(onTimeAverage) },
        { label: tp("avgDelayMinutes"), value: `${lateAverage.toFixed(1)} ${tp("minutes")}` },
      ]}
      infoText={t("descriptions.punctuality")}
    >
      <ResponsiveContainer width="100%" height={320}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
          <YAxis
            yAxisId="left"
            tickFormatter={(v) => formatPercent(Number(v))}
            domain={[0, 1]}
          />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip
            {...defaultTooltipProps}
            formatter={(value: number, name: string, item) => {
              const lowerName = name?.toString().toLowerCase() ?? "";
              const dataKey = (item as any)?.dataKey?.toString().toLowerCase?.() ?? "";
              const isLate =
                lowerName.includes("late") ||
                lowerName.includes("tarde") ||
                dataKey.includes("avglate");
              return isLate
                ? [`${Number(value).toFixed(1)} ${tp("minutes")}`, tp("lateLabel")]
                : [formatPercent(Number(value)), tp("onTimeLabel")];
            }}
            labelFormatter={(label) => `${tp("date")}: ${label}`}
          />
          <Legend />
          {series.map((branch) => {
            const label = branch.branchName ?? branch.branchId;
            return (
              <React.Fragment key={branch.branchId}>
                <Line
                  type="monotone"
                  data={branch.points}
                  dataKey="onTimeRate"
                  name={`${label} · ${tp("onTimeLabel")}`}
                  yAxisId="left"
                  stroke={hashBranchColor(branch.branchId)}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  data={branch.points}
                  dataKey="avgLateMinutes"
                  name={`${label} · ${tp("lateLabel")}`}
                  yAxisId="right"
                  stroke="#ff7043"
                  strokeDasharray="4 2"
                  strokeWidth={2}
                  dot={false}
                />
              </React.Fragment>
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
