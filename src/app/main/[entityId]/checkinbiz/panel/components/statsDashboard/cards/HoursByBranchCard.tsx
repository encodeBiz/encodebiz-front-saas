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
import { defaultLabelFromKey, defaultTooltipProps, formatHours, formatKpiEntries, hashBranchColor, normalizeSeriesNumbers } from "../chartUtils";
import { BranchSeries, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";

export const HoursByBranchCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
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
    metric: "hours_by_branch",
    granularity: "daily",
  });

  const series = normalizeSeriesNumbers(data?.dataset ?? [], ["workedHours"]);
  const totals =
    series.map((branch) => ({
      branchId: branch.branchId,
      total: branch.points.reduce((acc, p) => acc + (p.workedHours ?? 0), 0),
    }));

  const totalHours = totals.reduce((acc, item) => acc + item.total, 0);

  const apiKpis = formatKpiEntries(data?.kpis, kpiLabel);

  return (
    <StatCard
      title={t("hoursByBranch.title")}
      subtitle={t("hoursByBranch.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={[
        ...apiKpis,
        { label: "Horas totales", value: formatHours(totalHours) },
        {
          label: "Promedio por sucursal",
          value: formatHours(totals.length > 0 ? totalHours / totals.length : 0),
        },
      ]}
      infoText={t("descriptions.hoursByBranch")}
    >
      <ResponsiveContainer width="100%" height={260}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
          <YAxis domain={["dataMin", "dataMax"]} tickFormatter={(v) => formatHours(Number(v)).replace(" h", "")} />
          <Tooltip
            {...defaultTooltipProps}
            formatter={(value: number, name: string) => [formatHours(Number(value)), name]}
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
                dataKey="workedHours"
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
