'use client';

import {
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
} from "@mui/material";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { StatCard } from "../StatCard";
import { defaultLabelFromKey, formatCurrency, formatHours, formatKpiEntries } from "../chartUtils";
import { useCheckbizStats } from "../../hooks/useCheckbizStats";
import { CheckbizCardProps } from "./types";

type SalaryEstimateRow = {
  employeeId?: string;
  employeeName?: string;
  totalHours?: number;
  totalCost?: number;
  avgPrice?: number | null;
  jobNames?: string[];
  branches?: { branchId: string; branchName?: string }[];
};

export const SalaryEstimateCard = ({ entityId, branchId, from, to }: CheckbizCardProps) => {
  const t = useTranslations("statsDashboard.salaryEstimate");
  const tkpi = useTranslations("statsDashboard.kpiLabels");
  const tDesc = useTranslations("statsDashboard.descriptions");
  const { data, isLoading, error } = useCheckbizStats<SalaryEstimateRow[]>({
    entityId,
    branchId,
    from,
    to,
    metric: "salary_estimate",
    granularity: "total",
  });

  const rows = useMemo(() => {
    const dataset = data?.dataset ?? [];
    const sorted = [...dataset].sort((a, b) => (b.totalCost ?? 0) - (a.totalCost ?? 0));
    return sorted.map((item) => {
      const derivedPrice =
        item.avgPrice !== null && item.avgPrice !== undefined
          ? item.avgPrice
          : item.totalHours && item.totalHours > 0
          ? (item.totalCost ?? 0) / item.totalHours
          : null;
      return {
        ...item,
        derivedPrice,
      };
    });
  }, [data?.dataset]);

  const kpiLabel = (key: string) => {
    try {
      return tkpi(key as any);
    } catch {
      return defaultLabelFromKey(key);
    }
  };

  const apiKpis = formatKpiEntries(data?.kpis, kpiLabel);

  const footerTotals = {
    totalCost: rows.reduce((acc, r) => acc + (r.totalCost ?? 0), 0),
    totalHours: rows.reduce((acc, r) => acc + (r.totalHours ?? 0), 0),
    totalEmployees: rows.length,
  };

  return (
    <StatCard
      title={t("title")}
      subtitle={t("subtitle")}
      isLoading={isLoading}
      error={error}
      kpis={apiKpis}
      infoText={tDesc("salaryEstimate")}
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t("columns.employee")}</TableCell>
              <TableCell align="right">{t("columns.hours")}</TableCell>
              <TableCell align="right">{t("columns.avgPrice")}</TableCell>
              <TableCell>{t("columns.roles")}</TableCell>
              <TableCell>{t("columns.branches")}</TableCell>
              <TableCell align="right">{t("columns.totalCost")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.employeeId ?? row.employeeName}>
                <TableCell>
                  <Tooltip title={row.employeeName ?? row.employeeId ?? "-"} arrow>
                    <Typography
                      fontWeight={600}
                      noWrap
                      sx={{ maxWidth: 140, display: "inline-block" }}
                    >
                      {row.employeeName ?? "-"}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">{formatHours(row.totalHours)}</TableCell>
                <TableCell align="right">
                  {row.derivedPrice !== null && row.derivedPrice !== undefined
                    ? formatCurrency(row.derivedPrice)
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {(row.jobNames ?? []).map((role) => (
                      <Chip key={role} label={role} size="small" />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {(row.branches ?? []).map((b) => (
                      <Chip key={b.branchId} label={b.branchName ?? b.branchId} size="small" />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight={700}>{formatCurrency(row.totalCost)}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>{t("totals.employees", { value: footerTotals.totalEmployees })}</TableCell>
              <TableCell align="right">{formatHours(footerTotals.totalHours)}</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell align="right">
                <Typography fontWeight={700}>{formatCurrency(footerTotals.totalCost)}</Typography>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </StatCard>
  );
};
