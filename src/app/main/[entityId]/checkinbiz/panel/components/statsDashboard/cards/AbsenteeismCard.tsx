'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { StatCard } from "../StatCard";
import { formatKpiEntries, formatPercent, hashBranchColor } from "../chartUtils";
import { BranchAggregate, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";
import { useTranslations } from "next-intl";

export const AbsenteeismCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
  const t = useTranslations("statsDashboard");
  const { data, isLoading, error } = useCheckbizStats<BranchAggregate[]>({
    entityId,
    branchId,
    from,
    to,
    metric: "absenteeism",
    granularity: "total",
  });

  const dataset = data?.dataset ?? [];
  const totals = dataset.reduce(
    (acc, item) => ({
      active: acc.active + (item.activeDays ?? 0),
      inactive: acc.inactive + (item.inactiveDays ?? 0),
      rate:
        acc.rate + (item.activityRate !== undefined ? item.activityRate : 0),
    }),
    { active: 0, inactive: 0, rate: 0 },
  );

  const averageRate = dataset.length ? totals.rate / dataset.length : 0;
  const apiKpis = formatKpiEntries(data?.kpis);

  return (
    <StatCard
      title={t("absenteeism.title")}
      subtitle={t("absenteeism.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={[
        ...apiKpis,
        { label: "Dias activos", value: totals.active.toString() },
        { label: "Dias inactivos", value: totals.inactive.toString() },
        { label: "Actividad", value: formatPercent(averageRate) },
      ]}
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={dataset}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="branchName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="activeDays" name="Activos" stackId="days" radius={[6, 6, 0, 0]}>
            {dataset.map((item) => (
              <Cell key={item.branchId} fill={hashBranchColor(item.branchId ?? "branch")} />
            ))}
          </Bar>
          <Bar dataKey="inactiveDays" name="Inactivos" stackId="days" radius={[6, 6, 0, 0]} fill="#ef9a9a" />
        </BarChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
