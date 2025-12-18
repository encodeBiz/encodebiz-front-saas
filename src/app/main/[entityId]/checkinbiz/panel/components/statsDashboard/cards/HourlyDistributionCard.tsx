'use client';

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
} from "recharts";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { StatCard } from "../StatCard";
import { defaultLabelFromKey, formatKpiEntries, hashBranchColor } from "../chartUtils";
import { HourlyDistribution, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";
import { useTranslations } from "next-intl";

export const HourlyDistributionCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
  const t = useTranslations("statsDashboard");
  const theme = useTheme();
  const kpiLabel = (key: string) => {
    try {
      return t(`kpiLabels.${key}` as any);
    } catch {
      return defaultLabelFromKey(key);
    }
  };
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

  const activeBranch = useMemo(
    () => dataset.find((item) => item.branchId === activeBranchId),
    [dataset, activeBranchId],
  );
  const activeHours = activeBranch?.hours ?? [];
  const apiKpis = formatKpiEntries(data?.kpis, kpiLabel);

  return (
    <StatCard
      title={t("hourlyDistribution.title")}
      subtitle={t("hourlyDistribution.subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={apiKpis}
      infoText={t("descriptions.hourlyDistribution")}
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
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={activeHours}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis domain={[0, "dataMax"]} label={{ value: t("hourlyDistribution.axisLabel"), angle: -90, position: "insideLeft" }} />
          <Tooltip
            formatter={(value: number, name: string) =>
              name.toLowerCase().includes("avg")
                ? [`${Number(value).toFixed(2)} ${t("hourlyDistribution.people")}`, t("hourlyDistribution.avgEmployees")]
                : [`${Number(value).toFixed(2)}`, name]
            }
          />
          <Legend />
          <Bar dataKey="avgEmployees" name={t("hourlyDistribution.avgEmployees")} fill={theme.palette.primary.main} />
          <Line
            type="monotone"
            dataKey="startsPerDay"
            name={t("hourlyDistribution.startsPerDay")}
            stroke={theme.palette.success.main}
            strokeDasharray="4 2"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="endsPerDay"
            name={t("hourlyDistribution.endsPerDay")}
            stroke={theme.palette.error.main}
            strokeDasharray="4 2"
            dot={false}
          />
        </BarChart>
      </ResponsiveContainer>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
        {t("descriptions.hourlyDistribution")}
      </Typography>
    </StatCard>
  );
};
