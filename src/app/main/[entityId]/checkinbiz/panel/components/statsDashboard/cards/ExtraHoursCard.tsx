'use client';

import React from "react";
import { useTranslations } from "next-intl";
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
import { StatCard } from "../StatCard";
import { defaultLabelFromKey, formatHours, formatKpiEntries, normalizeSeriesNumbers } from "../chartUtils";
import { BranchSeries, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";

export const ExtraHoursCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
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
    metric: "extra_hours",
    granularity: "daily",
  });

  const series = normalizeSeriesNumbers(data?.dataset ?? [], [
    "expectedHours",
    "workedHours",
    "extraHours",
    "deficitHours",
  ]);
  const totals = series.reduce(
    (acc, branch) => {
      branch.points.forEach((item) => {
        acc.expected += item.expectedHours ?? 0;
        acc.worked += item.workedHours ?? 0;
        acc.extra += item.extraHours ?? 0;
        acc.deficit += item.deficitHours ?? 0;
      });
      return acc;
    },
    { expected: 0, worked: 0, extra: 0, deficit: 0 },
  );
  const apiKpis = formatKpiEntries(data?.kpis, kpiLabel);

  return (
    <StatCard
      title={t("extraHours.title")}
      subtitle={t("extraHours.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={[
        ...apiKpis,
        { label: "Esperadas", value: formatHours(totals.expected) },
        { label: "Trabajadas", value: formatHours(totals.worked) },
        { label: "Extra", value: formatHours(totals.extra) },
        { label: "Deficit", value: formatHours(totals.deficit) },
      ]}
      infoText={t("descriptions.extraHours")}
    >
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
          <YAxis domain={["dataMin", "dataMax"]} />
          <Tooltip formatter={(value: number) => Number(value).toFixed(2)} labelFormatter={(label) => `Fecha: ${label}`} />
          <Legend />
          {series.map((branch) => {
            const label = branch.branchName ?? branch.branchId;
            return (
              <React.Fragment key={branch.branchId}>
                <Bar data={branch.points} dataKey="workedHours" name={`${label} worked`} stackId={branch.branchId} fill="#2196f3" />
                <Bar data={branch.points} dataKey="expectedHours" name={`${label} expected`} stackId={branch.branchId} fill="#bbdefb" />
                <Line
                  type="monotone"
                  data={branch.points}
                  dataKey="extraHours"
                  name={`${label} extra`}
                  stroke="#4caf50"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  data={branch.points}
                  dataKey="deficitHours"
                  name={`${label} deficit`}
                  stroke="#f44336"
                  strokeWidth={2}
                  dot={false}
                />
              </React.Fragment>
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
