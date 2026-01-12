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
import { defaultLabelFromKey, defaultTooltipProps, formatCurrency, hashBranchColor, normalizeSeriesNumbers } from "../chartUtils";
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
  const kpis = (() => {
    const kpisData = (data as any)?.kpis ?? {};
    const items: { label: string; value: string }[] = [];
    const pushIfNumber = (label: string, value?: number | null, formatter?: (v: number) => string) => {
      if (value === null || value === undefined || Number.isNaN(Number(value))) return;
      items.push({ label, value: formatter ? formatter(Number(value)) : Number(value).toString() });
    };
    pushIfNumber("Costo total", kpisData.totalCost, (v) => formatCurrency(v));
    pushIfNumber("Horas totales", kpisData.totalHours, (v) => `${Number(v).toFixed(1)} h`);
    pushIfNumber("Prom. costo por hora", kpisData.avgCostPerHour, (v) => formatCurrency(v));
    const perBranch: { branchId: string; branchName?: string; costPerHour?: number | null }[] =
      kpisData.branchCostPerHour ?? [];
    perBranch.forEach((item) => {
      const label = item.branchName ?? item.branchId;
      if (item.costPerHour === null || item.costPerHour === undefined || Number.isNaN(Number(item.costPerHour))) {
        items.push({ label, value: "sin datos" });
      } else {
        items.push({ label, value: formatCurrency(Number(item.costPerHour)) });
      }
    });
    return items;
  })();

  return (
    <StatCard
      title={t("costPerHour.title")}
      subtitle={t("costPerHour.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={kpis}
      infoText={t("descriptions.costPerHour")}
    >
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
          <YAxis domain={["dataMin", "dataMax"]} tickFormatter={(v) => formatCurrency(Number(v))} />
          <Tooltip
            {...defaultTooltipProps}
            formatter={(value: number, name: string, payload) => {
              if (value === null || value === undefined) return null;
              const worked = (payload as any)?.payload?.workedHours;
              const workedText =
                worked === null || worked === undefined ? "" : ` · Horas: ${Number(worked).toFixed(1)}`;
              return [`${formatCurrency(Number(value))}${workedText}`, name];
            }}
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
                connectNulls={false}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
