'use client';

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslations } from "next-intl";
import React from "react";
import { StatCard } from "../StatCard";
import { defaultLabelFromKey, defaultTooltipProps, formatCurrency, formatKpiEntries, formatPercent, hashBranchColor, normalizeSeriesNumbers } from "../chartUtils";
import { BranchSeries, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";

export const CostVsBudgetCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
  const t = useTranslations("statsDashboard");
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
    metric: "cost_vs_budget",
    granularity: "daily",
  });

  const series = normalizeSeriesNumbers(data?.dataset ?? [], ["totalCost", "budget"]);
  const totalCost = series.reduce(
    (acc, branch) => acc + branch.points.reduce((sum, p) => sum + (p.totalCost ?? 0), 0),
    0,
  );
  const totalBudget = series.reduce(
    (acc, branch) =>
      acc +
      branch.points.reduce((sum, p) => sum + (p.budget ?? 0), 0),
    0,
  );
  const apiKpis = formatKpiEntries(data?.kpis, kpiLabel);

  const mergedData = React.useMemo(() => {
    const map = new Map<string, any>();
    series.forEach((branch) => {
      branch.points.forEach((p) => {
        const rec = map.get(p.date) ?? { date: p.date };
        rec[`${branch.branchId}-totalCost`] = p.totalCost ?? 0;
        rec[`${branch.branchId}-budget`] = p.budget ?? 0;
        map.set(p.date, rec);
      });
    });
    return Array.from(map.values()).sort((a, b) => `${a.date}`.localeCompare(`${b.date}`));
  }, [series]);

  return (
    <StatCard
      title={t("costVsBudget.title")}
      subtitle={t("costVsBudget.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={[
        ...apiKpis,
        { label: "Costo real", value: formatCurrency(totalCost) },
        { label: "Presupuesto", value: formatCurrency(totalBudget) },
        {
          label: "Desviacion",
          value: formatPercent(totalBudget ? ((totalCost - totalBudget) / totalBudget) * 100 : 0, false),
        },
      ]}
    >
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
          <YAxis domain={["dataMin", "dataMax"]} tickFormatter={(v) => formatCurrency(Number(v))} />
          <Tooltip
            {...defaultTooltipProps}
            formatter={(value: number, name: string) => {
              if (name?.toString().toLowerCase().includes("budget")) {
                return [formatCurrency(Number(value)), "Presupuesto"];
              }
              return [formatCurrency(Number(value)), "Costo"];
            }}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Legend />
          {series.flatMap((branch) => {
            const label = branch.branchName ?? branch.branchId;
            const color = hashBranchColor(branch.branchId);
            const costKey = `${branch.branchId}-totalCost`;
            const budgetKey = `${branch.branchId}-budget`;
            return [
              <Bar
                key={`${branch.branchId}-bar`}
                dataKey={costKey}
                name={`${label} cost`}
                radius={[6, 6, 0, 0]}
                fill={color}
              />,
              <Line
                key={`${branch.branchId}-line`}
                type="monotone"
                dataKey={budgetKey}
                name={`${label} budget`}
                stroke={hashBranchColor(branch.branchId, 0.8)}
                strokeDasharray="5 3"
                strokeWidth={2}
                dot={{ r: 3 }}
              />,
            ];
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
