'use client';

import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTranslations } from "next-intl";
import { StatCard } from "../StatCard";
import {   formatCurrency, hashBranchColor } from "../chartUtils";
import { useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";

type DistributionItem = {
  branchId: string;
  branchName?: string;
  totalCost?: number | null;
  employeesCount?: number | null;
  share?: number | null;
};

export const CostDistributionCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
  const t = useTranslations("statsDashboard");
  

  const { data, isLoading, error } = useCheckbizStats<DistributionItem[]>({
    entityId,
    branchId,
    from,
    to,
    metric: "cost_distribution",
    granularity: "total",
  });

  const dataset = data?.dataset ?? [];
  const hasData = (data as any)?.kpis?.activeBranches > 0;

  const kpis = useMemo(() => {
    const kpisData = (data as any)?.kpis ?? {};
    const items: { label: string; value: string }[] = [];
    const pushIfNumber = (label: string, value?: number | null, formatter?: (v: number) => string) => {
      if (value === null || value === undefined || Number.isNaN(Number(value))) return;
      items.push({ label, value: formatter ? formatter(Number(value)) : Number(value).toString() });
    };
    pushIfNumber("Costo total", kpisData.totalCost, (v) => formatCurrency(v));
    if (!Number.isNaN(Number(kpisData.activeBranches)) && !Number.isNaN(Number(kpisData.countBranches))) {
      items.push({
        label: "Sucursales activas / totales",
        value: `${kpisData.activeBranches ?? 0} / ${kpisData.countBranches ?? 0}`,
      });
    }
    if (kpisData.maxCostBranch && kpisData.maxCostBranch.cost !== null && kpisData.maxCostBranch.cost !== undefined) {
      const b = kpisData.maxCostBranch;
      items.push({
        label: "Top sucursal",
        value: `${b.branchName ?? b.branchId}: ${formatCurrency(Number(b.cost))} (${(Number(b.share ?? 0) * 100).toFixed(1)}%)`,
      });
    }
    if (kpisData.minCostBranch && Number(kpisData.minCostBranch.cost ?? 0) > 0) {
      const b = kpisData.minCostBranch;
      items.push({
        label: "Mínima",
        value: `${b.branchName ?? b.branchId}: ${formatCurrency(Number(b.cost))} (${(Number(b.share ?? 0) * 100).toFixed(1)}%)`,
      });
    }
    return items;
  }, [data]);

  return (
    <StatCard
      title={t("costDistribution.title")}
      subtitle={t("costDistribution.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={kpis}
      infoText={t("descriptions.costDistribution", { defaultMessage: "Distribución porcentual del coste por sucursal." })}
    >
      {!hasData ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="body1" color="text.secondary">
            {t("costDistribution.empty")}
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={dataset}
              dataKey="share"
              nameKey="branchName"
              cx="50%"
              cy="50%"
              outerRadius={110}
              paddingAngle={2}
            >
              {dataset.map((entry) => (
                <Cell key={entry.branchId} fill={hashBranchColor(entry.branchId)} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, _name: string, item) => {
                const entry = (item as any)?.payload as DistributionItem;
                const pct = (Number(value ?? 0) * 100).toFixed(1);
                const cost = entry.totalCost !== null && entry.totalCost !== undefined ? formatCurrency(Number(entry.totalCost)) : "-";
                return [`${cost} · ${pct}%`, entry.branchName ?? entry.branchId];
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </StatCard>
  );
};
