'use client';

import React, { useMemo } from "react";
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

  const averages = useMemo(() => {
    let startSum = 0;
    let endSum = 0;
    let count = 0;
    (data?.dataset ?? []).forEach((branch) => {
      branch.points.forEach((p) => {
        if (p.avgStart !== undefined && p.avgEnd !== undefined) {
          startSum += p.avgStart;
          endSum += p.avgEnd;
          count += 1;
        }
      });
    });
    return {
      avgStart: count ? startSum / count : 0,
      avgEnd: count ? endSum / count : 0,
    };
  }, [data?.dataset]);

  const series = normalizeSeriesNumbers(data?.dataset ?? [], ["avgStart", "avgEnd"]);

  const apiKpis = formatKpiEntries(data?.kpis, kpiLabel);

  return (
    <StatCard
      title={t("startEnd.title")}
      subtitle={t("startEnd.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={[
        ...apiKpis,
        { label: "Inicio promedio", value: `${averages.avgStart.toFixed(2)} h` },
        { label: "Fin promedio", value: `${averages.avgEnd.toFixed(2)} h` },
      ]}
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
                />
                <Line
                  type="monotone"
                  data={branch.points}
                  dataKey="avgEnd"
                  name={`${label} fin`}
                  stroke={hashBranchColor(branch.branchId, 0.6)}
                  strokeDasharray="4 2"
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
