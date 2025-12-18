'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { useTranslations } from "next-intl";
import { StatCard } from "../StatCard";
import { defaultLabelFromKey, formatKpiEntries, formatPercent, hashBranchColor } from "../chartUtils";
import { RankingItem, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";

interface BranchRankingProps extends CheckbizCardProps {
  topN?: number;
}

export const BranchRankingCard = ({
  entityId,
  branchId,
  from,
  to,
  topN = 5,
}: BranchRankingProps) => {
  const t = useTranslations("statsDashboard");
  const kpiLabel = (key: string) => {
    try {
      return t(`kpiLabels.${key}` as any);
    } catch {
      return defaultLabelFromKey(key);
    }
  };
  const { data, isLoading, error } = useCheckbizStats<RankingItem[]>({
    entityId,
    branchId,
    from,
    to,
    metric: "branch_ranking",
    granularity: "total",
    topN,
  });

  const dataset = [...(data?.dataset ?? [])]
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, topN)
    .map((item) => ({
      ...item,
      label: item.branchName ?? item.branchId ?? "",
    }));
  const apiKpis = formatKpiEntries(data?.kpis, kpiLabel);

  return (
    <StatCard
      title={t("branchRanking.title")}
      subtitle={t("branchRanking.subtitle", { topN })}
      isLoading={isLoading}
      error={error}
      kpis={apiKpis}
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={dataset} layout="vertical" margin={{ left: 32 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, "auto"]} />
          <YAxis type="category" dataKey="label" width={110} />
          <Tooltip
            formatter={(value: number, name: string, props) => {
              if (name === "complianceRate") return [formatPercent(Number(value)), "Cumplimiento"];
              if (name === "suspectRate") return [formatPercent(Number(value)), "Sospecha"];
              return [value, "Score"];
            }}
          />
          <Bar dataKey="score" name="Score" radius={[6, 6, 6, 6]}>
            {dataset.map((item) => (
              <Cell key={item.branchId} fill={hashBranchColor(item.branchId ?? "branch")} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
