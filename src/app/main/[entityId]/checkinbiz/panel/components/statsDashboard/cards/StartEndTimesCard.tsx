'use client';

import React from "react";
import { useTranslations } from "next-intl";
import {
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
import { defaultLabelFromKey, defaultTooltipProps, formatKpiEntries, hashBranchColor, normalizeSeriesNumbers } from "../chartUtils";
import { BranchSeries, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";

export const StartEndTimesCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
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
    metric: "start_end_times",
    granularity: "daily",
  });

  const series = normalizeSeriesNumbers(data?.dataset ?? [], ["avgStart", "avgEnd"]);

  const apiKpis = formatKpiEntries(data?.kpis, kpiLabel).filter((item) => item.value !== "-");

  return (
    <StatCard
      title={t("startEnd.title")}
      subtitle={t("startEnd.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={apiKpis}
      infoText={t("descriptions.startEnd")}
    >
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
          <YAxis />
          <Tooltip
            {...defaultTooltipProps}
            formatter={(value: number, name: string) => [`${Number(value).toFixed(2)} h`, name]}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          {series.length > 1 && <Legend />}
          {series.map((branch) => {
            const label = branch.branchName ?? branch.branchId;
            return (
              <React.Fragment key={branch.branchId}>
                <Line
                  type="monotone"
                  data={branch.points}
                dataKey="avgStart"
                  name={`${label} inicio`}
                  stroke={hashBranchColor(branch.branchId)}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
                <Line
                  type="monotone"
                  data={branch.points}
                  dataKey="avgEnd"
                  name={`${label} fin`}
                  stroke={hashBranchColor(branch.branchId, 0.6)}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
             </React.Fragment>
          );
        })}
        </ComposedChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
