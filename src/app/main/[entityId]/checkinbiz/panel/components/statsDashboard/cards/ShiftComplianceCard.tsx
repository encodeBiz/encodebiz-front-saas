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
import { StatCard } from "../StatCard";
import { formatKpiEntries, formatPercent, hashBranchColor, normalizeSeriesNumbers } from "../chartUtils";
import { BranchSeries, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";
import { useTranslations } from "next-intl";

export const ShiftComplianceCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
  const t = useTranslations("statsDashboard");
  const { data, isLoading, error } = useCheckbizStats<BranchSeries[]>({
    entityId,
    branchId,
    from,
    to,
    metric: "shift_compliance",
    granularity: "daily",
  });

  const series = normalizeSeriesNumbers(data?.dataset ?? [], ["complianceRate"]);
  const average =
    series.reduce(
      (acc, branch) => acc + branch.points.reduce((sum, p) => sum + (p.complianceRate ?? 0), 0),
      0,
    ) / (series.reduce((acc, branch) => acc + branch.points.length, 0) || 1);
  const apiKpis = formatKpiEntries(data?.kpis);

  return (
    <StatCard
      title={t("shiftCompliance.title")}
      subtitle={t("shiftCompliance.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={[...apiKpis, { label: "Promedio", value: formatPercent(average) }]}
    >
      <ResponsiveContainer width="100%" height={220}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
          <YAxis tickFormatter={(v) => formatPercent(Number(v))} domain={[0, 1]} />
          <Tooltip formatter={(value: number) => formatPercent(Number(value))} labelFormatter={(label) => `Fecha: ${label}`} />
          <Legend />
          {series.map((branch) => {
            const label = branch.branchName ?? branch.branchId;
            return (
              <Line
                key={branch.branchId}
                type="monotone"
                data={branch.points}
                dataKey="complianceRate"
                name={label}
                stroke={hashBranchColor(branch.branchId ?? "branch")}
                strokeWidth={2}
                dot={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
