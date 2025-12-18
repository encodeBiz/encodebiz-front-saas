'use client';

import React from "react";
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
import { StatCard } from "../StatCard";
import { defaultLabelFromKey, formatCurrency, formatHours, formatKpiEntries } from "../chartUtils";
import { useCheckbizStats, WeeklyTrend } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";

export const WeeklyTrendsCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
  const t = useTranslations("statsDashboard");
  const kpiLabel = (key: string) => {
    try {
      return t(`kpiLabels.${key}` as any);
    } catch {
      return defaultLabelFromKey(key);
    }
  };
  const { data, isLoading, error } = useCheckbizStats<WeeklyTrend[]>({
    entityId,
    branchId,
    from,
    to,
    metric: "weekly_trends",
    granularity: "weekly",
  });

  const dataset = data?.dataset ?? [];
  const totals = dataset.reduce(
    (acc, item) => ({
      cost: acc.cost + (item.cost ?? 0),
      hours: acc.hours + (item.hours ?? 0),
      suspects: acc.suspects + (item.suspects ?? 0),
    }),
    { cost: 0, hours: 0, suspects: 0 },
  );
  const apiKpis = formatKpiEntries(data?.kpis, kpiLabel);

  const branchIds = Array.from(
    new Set(
      dataset
        .flatMap((week) => week.branches?.map((b) => b.branchId) ?? [])
        .filter(Boolean) as string[],
    ),
  );

  const seriesByBranch = branchIds.map((id) => {
    const name =
      dataset.find((week) => week.branches?.find((b) => b.branchId === id)?.branchName)
        ?.branches?.find((b) => b.branchId === id)?.branchName ?? id;
    return {
      branchId: id,
      name,
      points: dataset.map((week) => {
        const branchWeek = week.branches?.find((b) => b.branchId === id);
        return {
          week: week.week,
          cost: branchWeek?.cost ?? 0,
          hours: branchWeek?.hours ?? 0,
          suspects: branchWeek?.suspects ?? 0,
        };
      }),
    };
  });

  return (
    <StatCard
      title={t("weeklyTrends.title")}
      subtitle={t("weeklyTrends.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={[
        ...apiKpis,
        { label: "Costo", value: formatCurrency(totals.cost) },
        { label: "Horas", value: formatHours(totals.hours) },
        { label: "Sospechas", value: totals.suspects.toString() },
      ]}
      infoText={t("descriptions.weeklyTrends")}
    >
      <ResponsiveContainer width="100%" height={260}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" allowDuplicatedCategory={false} />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name?.toString().toLowerCase().includes("costo")) return [formatCurrency(Number(value)), name];
              if (name?.toString().toLowerCase().includes("hora")) return [formatHours(Number(value)), name];
              return [Number(value).toFixed(0), name];
            }}
          />
          <Legend />
          {branchIds.length === 0 && (
            <>
              <Line type="monotone" dataKey="cost" data={dataset} name="Costo" stroke="#1976d2" strokeWidth={2} />
              <Line type="monotone" dataKey="hours" data={dataset} name="Horas" stroke="#4caf50" strokeWidth={2} />
              <Line type="monotone" dataKey="suspects" data={dataset} name="Sospechas" stroke="#ff9800" strokeWidth={2} />
            </>
          )}
          {branchIds.length > 0 &&
            seriesByBranch.flatMap((serie) => [
              <Line
                key={`${serie.branchId}-cost`}
                type="monotone"
                data={serie.points}
                dataKey="cost"
                name={`${serie.name} costo`}
                stroke="#1976d2"
                strokeWidth={2}
              />,
              <Line
                key={`${serie.branchId}-hours`}
                type="monotone"
                data={serie.points}
                dataKey="hours"
                name={`${serie.name} horas`}
                stroke="#4caf50"
                strokeWidth={2}
              />,
              <Line
                key={`${serie.branchId}-suspects`}
                type="monotone"
                data={serie.points}
                dataKey="suspects"
                name={`${serie.name} sospechas`}
                stroke="#ff9800"
                strokeWidth={2}
              />,
            ])}
        </LineChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
