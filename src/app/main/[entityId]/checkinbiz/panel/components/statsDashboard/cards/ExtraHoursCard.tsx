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
  TooltipProps,
} from "recharts";
import { Box, Paper, Typography } from "@mui/material";
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

  const mergedData = React.useMemo(() => {
    const map = new Map<string, any>();
    series.forEach((branch) => {
      branch.points.forEach((p) => {
        const rec = map.get(p.date) ?? { date: p.date };
        rec[`${branch.branchId}-workedHours`] = p.workedHours ?? 0;
        rec[`${branch.branchId}-expectedHours`] = p.expectedHours ?? 0;
        rec[`${branch.branchId}-extraHours`] = p.extraHours ?? 0;
        rec[`${branch.branchId}-deficitHours`] = p.deficitHours ?? 0;
        map.set(p.date, rec);
      });
    });
    return Array.from(map.values()).sort((a, b) => `${a.date}`.localeCompare(`${b.date}`));
  }, [series]);

  const CustomTooltip = ({ active, label, payload }: TooltipProps<number, string>) => {
    if (!active || !payload || payload.length === 0) return null;
    const grouped = payload.reduce<
      Record<
        string,
        {
          label: string;
          color?: string;
          expected?: number;
          worked?: number;
          extra?: number;
          deficit?: number;
        }
      >
    >((acc, item) => {
      if (typeof item.value !== "number" || Math.abs(item.value) < 0.001) return acc;
      const dataKey = String(item.dataKey ?? "");
      const [branchKey] = dataKey.split("-");
      const baseLabel = String(item.name ?? "").replace(/\s+(expected|worked|extra|deficit)$/i, "");
      const record = acc[branchKey] ?? { label: baseLabel, color: item.color };
      if (dataKey.includes("expectedHours")) record.expected = item.value;
      else if (dataKey.includes("workedHours")) record.worked = item.value;
      else if (dataKey.includes("extraHours")) record.extra = item.value;
      else if (dataKey.includes("deficitHours")) record.deficit = item.value;
      acc[branchKey] = record;
      return acc;
    }, {});
    const records = Object.values(grouped);
    if (!records.length) return null;

    const fmt = (num?: number) => (num === undefined ? "-" : `${num.toFixed(2)} h`);

    return (
      <Paper
        elevation={4}
        sx={{
          p: 1.5,
          maxWidth: 360,
          bgcolor: "background.paper",
          borderRadius: 1.5,
          overflow: "visible",
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.75 }}>{`Fecha: ${label}`}</Typography>
        {records.map((item) => (
          <Box key={item.label} sx={{ display: "flex", flexDirection: "column", gap: 0.25, mb: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color ?? "grey.500" }} />
              <Typography variant="body2" fontWeight={600}>
                {item.label}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {`Esperadas: ${fmt(item.expected)} • Trabajadas: ${fmt(item.worked)} • Extra: ${fmt(item.extra)} • Déficit: ${fmt(item.deficit)}`}
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  };

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
        <ComposedChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
          <YAxis domain={["dataMin", "dataMax"]} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ overflow: "visible" }} />
          <Legend />
          {series.map((branch) => {
            const label = branch.branchName ?? branch.branchId;
            const workedKey = `${branch.branchId}-workedHours`;
            const expectedKey = `${branch.branchId}-expectedHours`;
            const extraKey = `${branch.branchId}-extraHours`;
            const deficitKey = `${branch.branchId}-deficitHours`;
            return (
              <React.Fragment key={branch.branchId}>
                <Bar dataKey={workedKey} name={`${label} worked`} stackId={branch.branchId} fill="#2196f3" />
                <Bar dataKey={expectedKey} name={`${label} expected`} stackId={branch.branchId} fill="#bbdefb" />
                <Line
                  type="monotone"
                  dataKey={extraKey}
                  name={`${label} extra`}
                  stroke="#4caf50"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={deficitKey}
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
