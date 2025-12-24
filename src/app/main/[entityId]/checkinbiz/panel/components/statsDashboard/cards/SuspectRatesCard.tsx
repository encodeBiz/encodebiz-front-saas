'use client';

import React, { useMemo } from "react";
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
import { Stack, Typography, Chip, Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { StatCard } from "../StatCard";
import {
  alignSeriesByDate,
  defaultLabelFromKey,
  defaultTooltipProps,
  normalizeSeriesNumbers,
  hashBranchColor,
} from "../chartUtils";
import { BranchSeries, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";

type TopBranch = {
  branchId: string;
  branchName?: string;
  suspects?: number;
  failed?: number;
  valid?: number;
  totalChecklogs?: number;
  suspectRate?: number;
  failureRate?: number;
  validRate?: number;
  suspectsPer1k?: number;
  failurePer1k?: number;
};

export const SuspectRatesCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
  const t = useTranslations("statsDashboard");
  const safeText = (key: string, fallback: string) => {
    try {
      return t(key as any);
    } catch {
      return fallback;
    }
  };
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
    metric: "suspect_rates",
    granularity: "daily",
  });

  const mappedSeries =
    data?.dataset?.map((branch) => ({
      ...branch,
      points: branch.points.map((p) => ({
        ...p,
        suspectRate: p.suspectRate ?? null,
        failureRate: p.failureRate ?? null,
      })),
    })) ?? [];

  const series = alignSeriesByDate(
    normalizeSeriesNumbers(mappedSeries, ["suspectRate", "failureRate"]),
    ["suspectRate", "failureRate"],
    null,
  );

  const kpis = useMemo(() => {
    const k = (data as any)?.kpis as Record<string, any> | undefined;
    if (!k) return [];
    const formatRate = (value?: number | null) =>
      value === null || value === undefined || Number.isNaN(Number(value))
        ? "-"
        : `${(Number(value) * 100).toFixed(1)}%`;
    const formatPer1k = (value?: number | null) =>
      value === null || value === undefined || Number.isNaN(Number(value))
        ? "-"
        : Number(value).toFixed(1);

    const totalSuspects = k.totalSuspects ?? 0;
    const totalValid = k.totalValid ?? 0;
    const totalChecklogs = k.totalChecklogs ?? 0;
    const validRate = totalChecklogs ? totalValid / totalChecklogs : null;

    const items = [
      { label: kpiLabel("suspectRate"), value: formatRate(k.suspectRate) },
      { label: kpiLabel("failureRate"), value: formatRate(k.failureRate) },
      { label: kpiLabel("validRate"), value: formatRate(k.validRate ?? validRate) },
      {
        label: t("suspectRates.totalsLabel"),
        value: `${totalSuspects} / ${totalChecklogs || "-"}`,
      },
    ];
    return items;
  }, [data, kpiLabel, t]);

  const topBranches: TopBranch[] = useMemo(() => {
    const incoming: TopBranch[] = (data as any)?.kpis?.topBranches ?? [];
    return [...incoming]
      .map((b) => ({
        ...b,
        validRate:
          b.totalChecklogs && b.totalChecklogs > 0
            ? (b.valid ?? 0) / b.totalChecklogs
            : b.valid ?? 0,
      }))
      .sort((a, b) => (b.suspectRate ?? 0) - (a.suspectRate ?? 0));
  }, [data]);

  const badColor = (rate?: number | null) => {
    const value = Number(rate);
    if (!Number.isFinite(value)) return "#9e9e9e";
    return "#d32f2f";
  };

  const goodColor = (rate?: number | null) => {
    const value = Number(rate);
    if (!Number.isFinite(value)) return "#9e9e9e";
    return "#2e7d32";
  };

  return (
    <StatCard
      title={t("suspectRates.title")}
      subtitle={t("suspectRates.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={kpis}
      infoText={t("descriptions.suspectRates")}
    >
      <Stack spacing={2}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
            <YAxis tickFormatter={(v) => `${(Number(v) * 100).toFixed(0)}%`} domain={[0, "dataMax"]} />
            <Tooltip
              {...defaultTooltipProps}
              labelFormatter={(label) => `Fecha: ${label}`}
              formatter={(value: number, _name: string, item) => {
                const dataKey = (item as any)?.dataKey?.toString() ?? "";
                const lower = dataKey.toLowerCase();
                  const label = lower.includes("failure")
                    ? safeText("suspectRates.failureRateLabel", "Tasa fallidos")
                    : safeText("suspectRates.suspectRateLabel", "Tasa sospechosos");
                  return [`${(Number(value) * 100).toFixed(1)}%`, `${item?.name ?? label}`];
              }}
            />
            <Legend />
            {series.map((branch) => {
              const label = branch.branchName ?? branch.branchId;
              const hasSuspectRate = branch.points.some(
                (p) => p.suspectRate !== null && p.suspectRate !== undefined,
              );
              const hasFailureRate = branch.points.some(
                (p) => p.failureRate !== null && p.failureRate !== undefined,
              );
              return (
                <React.Fragment key={branch.branchId}>
                  {hasSuspectRate && (
                    <Line
                      type="monotone"
                      data={branch.points}
                      dataKey="suspectRate"
                      name={`${label} · ${safeText("suspectRates.suspectRateLabel", "Sospechosos (%)")}`}
                      stroke={hashBranchColor(branch.branchId)}
                      strokeWidth={2}
                      dot={false}
                      connectNulls={false}
                    />
                  )}
                  {hasFailureRate && (
                    <Line
                      type="monotone"
                      data={branch.points}
                      dataKey="failureRate"
                      name={`${label} · ${safeText("suspectRates.failureRateLabel", "Fallidos (%)")}`}
                      stroke={hashBranchColor(`${branch.branchId}-fail`)}
                      strokeWidth={2}
                      dot={false}
                      connectNulls={false}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </LineChart>
        </ResponsiveContainer>

        {topBranches.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {safeText("suspectRates.topBranchesLabel", "Ranking sucursales")}
            </Typography>
            <Stack spacing={1}>
              {topBranches.map((b, idx) => {
                const failColor = badColor(b.failureRate);
                const suspectColor = badColor(b.suspectRate);
                const validColor = goodColor(b.validRate);
                return (
                  <Stack
                    key={b.branchId}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                      borderRadius: 14,
                      p: 1.4,
                      border: "1px solid rgba(0,0,0,0.06)",
                      background: "linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0))",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        backgroundColor: (theme) => theme.palette.primary.main,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 12,
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Stack spacing={0.6} sx={{ width: "100%" }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography fontWeight={700}>{b.branchName ?? b.branchId}</Typography>
                        <Chip
                          size="small"
                          label={`${(Number(b.suspectRate ?? 0) * 100).toFixed(1)}% ${safeText("suspectRates.suspectRateLabel", "Tasa de sospecha")}`}
                          sx={{
                            backgroundColor: (theme) => `${theme.palette.error.main}1A`,
                            color: (theme) => theme.palette.error.main,
                            fontWeight: 600,
                          }}
                        />
                        <Chip
                          size="small"
                          label={`${(Number(b.failureRate ?? 0) * 100).toFixed(1)}% ${safeText("suspectRates.failureRateLabel", "Tasa de fallos")}`}
                          sx={{
                            backgroundColor: (theme) => `${theme.palette.error.main}1A`,
                            color: (theme) => theme.palette.error.main,
                            fontWeight: 600,
                          }}
                        />
                        <Chip
                          size="small"
                          label={`${(Number(b.validRate ?? 0) * 100).toFixed(1)}% ${safeText("kpiLabels.validRate", "Tasa de válidos")}`}
                          sx={{
                            backgroundColor: `${validColor}22`,
                            color: validColor,
                            fontWeight: 600,
                          }}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {`${safeText("suspectRates.countsLabel", "S/F/V")}: ${b.suspects ?? 0}/${b.failed ?? 0}/${b.valid ?? 0} · ${safeText("suspectRates.totalChecklogsLabel", "Total")}: ${b.totalChecklogs ?? 0}`}
                      </Typography>
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
          </Box>
        )}
      </Stack>
    </StatCard>
  );
};
