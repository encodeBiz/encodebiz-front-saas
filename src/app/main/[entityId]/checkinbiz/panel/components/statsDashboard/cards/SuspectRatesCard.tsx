'use client';

import React, { useMemo } from "react";
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
import { StatCard } from "../StatCard";
import { defaultLabelFromKey, defaultTooltipProps, formatKpiEntries, formatPercent, normalizeSeriesNumbers } from "../chartUtils";
import { BranchSeries, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";
import { useTranslations } from "next-intl";

export const SuspectRatesCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
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
    metric: "suspect_rates",
    granularity: "daily",
  });

  const series = normalizeSeriesNumbers(data?.dataset ?? [], ["suspects", "failed", "valid"]);
  const totals = useMemo(
    () =>
      series.reduce(
        (acc, branch) => {
          branch.points.forEach((p) => {
            acc.suspects += p.suspects ?? 0;
            acc.failed += p.failed ?? 0;
            acc.valid += p.valid ?? 0;
          });
          return acc;
        },
        { suspects: 0, failed: 0, valid: 0 },
      ),
    [series],
  );

  const totalChecks = totals.suspects + totals.failed + totals.valid;
  const suspectRate = totalChecks ? (totals.suspects / totalChecks) * 100 : 0;
  const apiKpis = formatKpiEntries(data?.kpis, kpiLabel);

  return (
    <StatCard
      title={t("suspectRates.title")}
      subtitle={t("suspectRates.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={[
        ...apiKpis,
        { label: "Sospechosos", value: totals.suspects.toFixed(0) },
        { label: "Fallidos", value: totals.failed.toFixed(0) },
        { label: "Validos", value: totals.valid.toFixed(0) },
        { label: "Tasa sospecha", value: formatPercent(suspectRate, false) },
      ]}
      infoText={t("descriptions.suspectRates")}
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart stackOffset="none">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
          <YAxis domain={["dataMin", "dataMax"]} />
          <Tooltip
            {...defaultTooltipProps}
            labelFormatter={(label) => `Fecha: ${label}`}
            formatter={(value: number) => Number(value).toFixed(2)}
          />
          <Legend />
          {series.map((branch) => {
            const label = branch.branchName ?? branch.branchId;
            return (
              <React.Fragment key={branch.branchId}>
                <Area
                  type="monotone"
                  data={branch.points}
                  dataKey="suspects"
                  name={`${label} suspects`}
                  stackId={branch.branchId}
                  stroke="#ff9800"
                  fill="#ffb74d"
                />
                <Area
                  type="monotone"
                  data={branch.points}
                  dataKey="failed"
                  name={`${label} failed`}
                  stackId={branch.branchId}
                  stroke="#f44336"
                  fill="#ef9a9a"
                />
                <Area
                  type="monotone"
                  data={branch.points}
                  dataKey="valid"
                  name={`${label} valid`}
                  stackId={branch.branchId}
                  stroke="#66bb6a"
                  fill="#a5d6a7"
                />
              </React.Fragment>
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
