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
import { defaultLabelFromKey, defaultTooltipProps, formatKpiEntries, formatPercent, hashBranchColor, normalizeSeriesNumbers } from "../chartUtils";
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

  const series = normalizeSeriesNumbers(data?.dataset ?? [], ["avgDistance", "withinRate"]);
  const threshold = series.find((b) => b.threshold !== undefined)?.threshold;
  const withinRates = useMemo(
    () =>
      series.map((branch) => {
        const avgWithin =
          branch.points.reduce((acc, p) => acc + (p.withinRate ?? 0), 0) /
          (branch.points.length || 1);
        const avgDistance =
          branch.points.reduce((acc, p) => acc + (p.avgDistance ?? 0), 0) /
          (branch.points.length || 1);
        return { branchId: branch.branchId, branchName: branch.branchName, withinRate: avgWithin, avgDistance };
      }),
    [series],
  );

  const apiKpis = formatKpiEntries(data?.kpis, kpiLabel);

  return (
    <StatCard
      title={t("geoCompliance.title")}
      subtitle={t("geoCompliance.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={[
        ...apiKpis,
        {
          label: "Dentro de umbral",
          value: formatPercent(
            withinRates.reduce((acc, item) => acc + item.withinRate, 0) /
              (withinRates.length || 1),
          ),
        },
        threshold !== undefined ? { label: "Umbral", value: `${threshold} m` } : undefined,
      ].filter(Boolean) as { label: string; value: string }[]}
      infoText={t("descriptions.geoCompliance")}
    >
      <ResponsiveContainer width="100%" height={240}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
          <YAxis domain={["dataMin", "dataMax"]} />
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
