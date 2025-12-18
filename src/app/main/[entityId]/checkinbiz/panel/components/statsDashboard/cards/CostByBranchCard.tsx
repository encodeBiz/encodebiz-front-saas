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
import { StatCard } from "../StatCard";
import { defaultLabelFromKey, defaultTooltipProps, formatCurrency, formatKpiEntries, hashBranchColor, normalizeSeriesNumbers } from "../chartUtils";
import { BranchSeries, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";

export const CostByBranchCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
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
    metric: "cost_by_branch",
    granularity: "daily",
  });

  const series = normalizeSeriesNumbers(data?.dataset ?? [], ["totalCost"]);
  const totals = series.map((branch) => ({
    branchId: branch.branchId,
    total: branch.points.reduce((acc, p) => acc + (p.totalCost ?? 0), 0),
  }));

  const totalCost = totals.reduce((acc, item) => acc + item.total, 0);
  const kpis = [
    {
      label: "Gasto total",
      value: formatCurrency(totalCost),
    },
    {
      label: "Promedio por sucursal",
      value: formatCurrency(totals.length > 0 ? totalCost / totals.length : 0),
    },
  ];

  const apiKpis = formatKpiEntries(data?.kpis, kpiLabel);

  return (
    <StatCard
      title={t("costByBranch.title")}
      subtitle={t("costByBranch.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={[...apiKpis, ...kpis]}
      infoText={t("descriptions.costByBranch")}
    >
      <ResponsiveContainer width="100%" height={320}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
          <YAxis
            domain={["dataMin", "dataMax"]}
            tickFormatter={(v) => formatCurrency(Number(v))}
          />
          <Tooltip
            {...defaultTooltipProps}
            formatter={(value: number, name: string) => [formatCurrency(Number(value)), name]}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          {series.length > 1 && <Legend />}
          {series.map((branch) => {
            const label = branch.branchName ?? branch.branchId;
            return (
              <Line
                key={branch.branchId}
                type="monotone"
                data={branch.points}
                dataKey="totalCost"
                name={label}
                stroke={hashBranchColor(branch.branchId)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
