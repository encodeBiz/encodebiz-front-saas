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
import { formatKpiEntries, formatPercent, hashBranchColor, normalizeSeriesNumbers } from "../chartUtils";
import { BranchSeries, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";

export const PunctualityCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
  const t = useTranslations("statsDashboard");
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
  const apiKpis = formatKpiEntries(data?.kpis);

  return (
    <StatCard
      title={t("punctuality.title")}
      subtitle={t("punctuality.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={[
        ...apiKpis,
        { label: "On-time rate", value: formatPercent(onTimeAverage) },
        { label: "Min. atraso prom.", value: `${lateAverage.toFixed(1)} min` },
      ]}
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
            formatter={(value: number, name: string) => {
              const isLate = name?.toString().toLowerCase().includes("late");
              return isLate ? [`${Number(value).toFixed(1)} min`, "Atraso"] : [formatPercent(Number(value)), name];
            }}
            labelFormatter={(label) => `Fecha: ${label}`}
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
                  name={`${label} on-time`}
                  yAxisId="left"
                  stroke={hashBranchColor(branch.branchId)}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  data={branch.points}
                  dataKey="avgLateMinutes"
                  name={`${label} late (min)`}
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
