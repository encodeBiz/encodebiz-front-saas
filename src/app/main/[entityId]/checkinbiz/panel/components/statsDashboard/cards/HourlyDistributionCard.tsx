'use client';

import { useEffect, useMemo, useState } from "react";
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
import { Box, Tab, Tabs } from "@mui/material";
import { StatCard } from "../StatCard";
import { formatKpiEntries, hashBranchColor } from "../chartUtils";
import { HourlyDistribution, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";
import { useTranslations } from "next-intl";

export const HourlyDistributionCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
  const t = useTranslations("statsDashboard");
  const { data, isLoading, error } = useCheckbizStats<HourlyDistribution[]>({
    entityId,
    branchId,
    from,
    to,
    metric: "hourly_distribution",
    granularity: "hourly",
  });

  const dataset = data?.dataset ?? [];
  const [selectedBranch, setSelectedBranch] = useState(dataset[0]?.branchId);

  useEffect(() => {
    if (dataset.length && !selectedBranch) {
      setSelectedBranch(dataset[0].branchId);
    }
  }, [dataset, selectedBranch]);

  const activeBranchId = selectedBranch ?? dataset[0]?.branchId;

  const activeHours = useMemo(
    () => dataset.find((item) => item.branchId === activeBranchId)?.hours ?? [],
    [dataset, activeBranchId],
  );
  const apiKpis = formatKpiEntries(data?.kpis);

  return (
    <StatCard
      title={t("hourlyDistribution.title")}
      subtitle={t("hourlyDistribution.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={apiKpis}
    >
      {dataset.length > 1 && (
        <Box display="flex" justifyContent="flex-start">
          <Tabs
            value={activeBranchId}
            onChange={(_, value) => setSelectedBranch(value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {dataset.map((branch) => (
              <Tab
                key={branch.branchId}
                label={branch.branchName ?? branch.branchId}
                value={branch.branchId}
              />
            ))}
          </Tabs>
        </Box>
      )}
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={activeHours}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="coverage" name="Cobertura" fill={hashBranchColor(activeBranchId ?? "branch")} />
          <Line type="monotone" dataKey="starts" name="Inicios" stroke="#4caf50" />
          <Line type="monotone" dataKey="ends" name="Finales" stroke="#f44336" />
        </ComposedChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
