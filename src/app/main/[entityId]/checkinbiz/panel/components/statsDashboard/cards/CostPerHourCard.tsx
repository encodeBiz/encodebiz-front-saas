'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
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

export const CostPerHourCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
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
    metric: "cost_per_hour",
    granularity: "daily",
  });

  const series = normalizeSeriesNumbers(data?.dataset ?? [], ["costPerHour"]);
  const averages =
    series.map((branch) => ({
      branchId: branch.branchId,
      branchName: branch.branchName ?? branch.branchId,
      avg:
        branch.points.reduce((acc, p) => acc + (p.costPerHour ?? 0), 0) /
        (branch.points.length || 1),
    }));

  const apiKpis = formatKpiEntries(data?.kpis, kpiLabel);

  return (
    <StatCard
      title={t("costPerHour.title")}
      subtitle={t("costPerHour.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={[
        ...apiKpis,
        ...averages.map((item) => ({
          label: item.branchName,
          value: formatCurrency(item.avg),
        })),
      ]}
      infoText={t("descriptions.costPerHour")}
    >
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
          <YAxis domain={["dataMin", "dataMax"]} tickFormatter={(v) => formatCurrency(Number(v))} />
          <Tooltip
            {...defaultTooltipProps}
            formatter={(value: number, name: string) => [formatCurrency(Number(value)), name]}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          {series.length > 1 && <Legend />}
          {series.map((branch) => {
            const label = branch.branchName ?? branch.branchId;
            return (
              <Area
                key={branch.branchId}
                type="monotone"
                data={branch.points}
                dataKey="costPerHour"
                name={label}
                stroke={hashBranchColor(branch.branchId)}
                fill={hashBranchColor(branch.branchId, 0.15)}
                strokeWidth={2}
                activeDot={{ r: 3 }}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
