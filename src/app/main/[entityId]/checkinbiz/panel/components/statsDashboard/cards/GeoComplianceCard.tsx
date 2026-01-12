/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard } from "../StatCard";
import { defaultLabelFromKey, defaultTooltipProps, hashBranchColor, normalizeSeriesNumbers, alignSeriesByDate } from "../chartUtils";
import { BranchSeries, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";
import { useTranslations } from "next-intl";

export const GeoComplianceCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
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
    metric: "geo_compliance",
    granularity: "daily",
  });

  const series = alignSeriesByDate(
    normalizeSeriesNumbers(data?.dataset ?? [], ["avgDistance"]),
    ["avgDistance"],
    null,
  );
  const threshold = series.find((b) => b.threshold !== undefined)?.threshold;
  const kpis = useMemo(() => {
    const entries: { label: string; value: string }[] = [];
    const avgDistance = (data as any)?.kpis?.avgDistance;
    const samples = (data as any)?.kpis?.samples;
    if (avgDistance !== undefined && avgDistance !== null && !Number.isNaN(Number(avgDistance))) {
      entries.push({ label: kpiLabel("avgDistance"), value: `${Number(avgDistance).toFixed(1)} m` });
    }
    if (samples !== undefined && samples !== null && !Number.isNaN(Number(samples))) {
      entries.push({ label: kpiLabel("samples"), value: Number(samples).toString() });
    }
    if (threshold !== undefined) {
      entries.push({ label: kpiLabel("threshold"), value: `${threshold} m` });
    }
    return entries;
  }, [data, kpiLabel, threshold]);

  return (
    <StatCard
      title={t("geoCompliance.title")}
      subtitle={t("geoCompliance.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={kpis}
      infoText={t("descriptions.geoCompliance")}
    >
      <ResponsiveContainer width="100%" height={240}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
          <YAxis domain={["dataMin", "dataMax"]} tickFormatter={(v) => `${Number(v).toFixed(1)} m`} />
          <Tooltip
            {...defaultTooltipProps}
            labelFormatter={(label) => `Fecha: ${label}`}
            formatter={(value: number) => [`${Number(value).toFixed(1)} m`, "Distancia"]}
          />
          {threshold !== undefined && (
            <ReferenceLine y={threshold} stroke="#f44336" strokeDasharray="4 2" label="Umbral" />
          )}
          {series.length > 1 && <Legend />}
          {series.map((branch) => {
            const label = branch.branchName ?? branch.branchId;
            return (
              <Line
                key={branch.branchId}
                type="monotone"
                data={branch.points}
                dataKey="avgDistance"
                name={label}
                stroke={hashBranchColor(branch.branchId)}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
      {/* <ResponsiveContainer width="100%" height={180}>
        <BarChart data={withinRates}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="branchName" />
          <YAxis tickFormatter={(v) => formatPercent(Number(v), true)} />
          <Tooltip {...defaultTooltipProps} formatter={(value: number) => formatPercent(Number(value), true)} />
          {series.length > 1 && <Legend />}
          <Bar dataKey="withinRate" name="Cumplimiento" radius={[6, 6, 0, 0]}>
            {withinRates.map((item) => (
              <Cell key={item.branchId} fill={hashBranchColor(item.branchId)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer> */}
    </StatCard>
  );
};
