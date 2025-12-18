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
import { formatCurrency, formatHours, formatKpiEntries } from "../chartUtils";
import { RankingItem, useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";

interface EmployeeProductivityProps extends CheckbizCardProps {
  topN?: number;
}

export const EmployeeProductivityCard = ({
  entityId,
  branchId,
  from,
  to,
  topN = 5,
}: EmployeeProductivityProps) => {
  const t = useTranslations("statsDashboard");
  const { data, isLoading, error } = useCheckbizStats<RankingItem[]>({
    entityId,
    branchId,
    from,
    to,
    metric: "employee_productivity",
    granularity: "total",
    topN,
  });

  const dataset = (data?.dataset ?? []).slice(0, topN).map((item) => ({
    ...item,
    label: item.employeeId ?? "",
  }));
  const apiKpis = formatKpiEntries(data?.kpis);

  return (
    <StatCard
      title={t("employeeProductivity.title")}
      subtitle={t("employeeProductivity.subtitle", { topN })}
      isLoading={isLoading}
      error={error}
      kpis={apiKpis}
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={dataset} layout="vertical" margin={{ left: 32 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="label" type="category" width={110} />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "hours") return [formatHours(Number(value)), "Horas"];
              if (name === "cost") return [formatCurrency(Number(value)), "Costo"];
              return [formatCurrency(Number(value)), "Costo/hora"];
            }}
          />
          <Bar dataKey="costPerHour" name="Costo/hora" radius={[6, 6, 6, 6]}>
            {dataset.map((item) => (
              <Cell key={item.employeeId} fill="#42a5f5" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </StatCard>
  );
};
