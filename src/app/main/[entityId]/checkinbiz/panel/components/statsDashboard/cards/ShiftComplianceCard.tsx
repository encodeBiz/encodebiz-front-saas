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
import { defaultLabelFromKey, defaultTooltipProps, formatKpiEntries, formatPercent, hashBranchColor, normalizeSeriesNumbers } from "../chartUtils";
import { BranchSeries, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";
import { useTranslations } from "next-intl";

export const ShiftComplianceCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
  const t = useTranslations("statsDashboard");
  const tkpi = useTranslations("statsDashboard.kpiLabels");
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
    metric: "shift_compliance",
    granularity: "daily",
  });

  const series = normalizeSeriesNumbers(data?.dataset ?? [], ["complianceRate"]);
  const apiKpis = formatKpiEntries(data?.kpis, kpiLabel).filter((item) => item.value !== "-");

  return (
    <StatCard
      title={t("shiftCompliance.title")}
      subtitle={t("shiftCompliance.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={apiKpis}
      infoText={t("descriptions.shiftCompliance")}
    >
      <ResponsiveContainer width="100%" height={220}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
          <YAxis tickFormatter={(v) => formatPercent(Number(v))} domain={[0, 1]} />
          <Tooltip
            {...defaultTooltipProps}
            formatter={(value: number) => formatPercent(Number(value))}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
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
                connectNulls
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
