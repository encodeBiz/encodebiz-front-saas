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
  const apiKpis = (() => {
    const kpis = (data as any)?.kpis ?? {};
    const items: { label: string; value: string }[] = [];
    const pushIfNumber = (label: string, value?: number | null, formatter?: (v: number) => string) => {
      if (value === null || value === undefined || Number.isNaN(Number(value))) return;
      items.push({ label, value: formatter ? formatter(Number(value)) : Number(value).toString() });
    };
    pushIfNumber("Costo total", kpis.totalCost, (v) => formatCurrency(v));
    if (!Number.isNaN(Number(kpis.activeBranches)) && !Number.isNaN(Number(kpis.countBranches))) {
      items.push({
        label: "Sucursales activas / totales",
        value: `${kpis.activeBranches ?? 0} / ${kpis.countBranches ?? 0}`,
      });
    }
    pushIfNumber(kpiLabel("avgCostPerEmployee"), kpis.avgCostPerEmployee, (v) => formatCurrency(v));
    if (kpis.maxCostBranch && kpis.maxCostBranch.cost !== null && kpis.maxCostBranch.cost !== undefined) {
      const b = kpis.maxCostBranch;
      items.push({
        label: "Top sucursal",
        value: `${b.branchName ?? b.branchId}: ${formatCurrency(Number(b.cost))} (${(Number(b.share ?? 0) * 100).toFixed(1)}%)`,
      });
    }
    if (kpis.minCostBranch && Number(kpis.minCostBranch.cost ?? 0) > 0) {
      const b = kpis.minCostBranch;
      items.push({
        label: "Mínima",
        value: `${b.branchName ?? b.branchId}: ${formatCurrency(Number(b.cost))} (${(Number(b.share ?? 0) * 100).toFixed(1)}%)`,
      });
    }
    return items;
  })();

  return (
    <StatCard
      title={t("costByBranch.title")}
      subtitle={t("costByBranch.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={apiKpis}
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
            formatter={(value: number | null | undefined, name: string, payload) => {
              if (value === null || value === undefined) return null;
              const emp = (payload as any)?.payload?.employeesCount;
              const empText =
                emp === null || emp === undefined ? "" : ` · Empleados: ${emp}`;
              return [`${formatCurrency(Number(value))}${empText}`, name];
            }}
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
                connectNulls
                activeDot={{ r: 4 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
