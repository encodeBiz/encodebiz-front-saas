'use client';

import { useMemo } from "react";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import GenericTabs from "@/components/common/tabs/GenericTabs";
import { CheckbizCardProps } from "./cards/types";
import { CostByBranchCard } from "./cards/CostByBranchCard";
import { HoursByBranchCard } from "./cards/HoursByBranchCard";
import { CostPerHourCard } from "./cards/CostPerHourCard";
import { SuspectRatesCard } from "./cards/SuspectRatesCard";
import { StartEndTimesCard } from "./cards/StartEndTimesCard";
import { GeoComplianceCard } from "./cards/GeoComplianceCard";
// import { AbsenteeismCard } from "./cards/AbsenteeismCard";
import { PunctualityCard } from "./cards/PunctualityCard";
import { ExtraHoursCard } from "./cards/ExtraHoursCard";
import { ShiftComplianceCard } from "./cards/ShiftComplianceCard";
import { WeeklyTrendsCard } from "./cards/WeeklyTrendsCard";
// import { EmployeeProductivityCard } from "./cards/EmployeeProductivityCard";
import { HourlyDistributionCard } from "./cards/HourlyDistributionCard";
import { SalaryEstimateCard } from "./cards/SalaryEstimateCard";
import { CostDistributionCard } from "./cards/CostDistributionCard";

type DashboardProps = CheckbizCardProps & {
  topN?: number;
};

const GridLayout = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
      gap: 3,
      width: "100%",
    }}
  >
    {children}
  </Box>
);

export const CheckbizStatsDashboard = ({
  entityId,
  branchId,
  from,
  to,
}: DashboardProps) => {
  const t = useTranslations("statsDashboard");
  const tabs = useMemo(
    () => [
      {
        id: "costs",
        label: t("tabs.costs"),
        content: (
          <GridLayout>
            <Box sx={{ gridColumn: "1 / -1" }}>
              <CostByBranchCard entityId={entityId} branchId={branchId} from={from} to={to} />
            </Box>
            <Box>
              <CostDistributionCard entityId={entityId} branchId={branchId} from={from} to={to} />
            </Box>
            <Box>
              <HoursByBranchCard entityId={entityId} branchId={branchId} from={from} to={to} />
            </Box>
            <Box sx={{ gridColumn: "1 / -1" }}>
              <CostPerHourCard entityId={entityId} branchId={branchId} from={from} to={to} />
            </Box>
            <Box sx={{ gridColumn: "1 / -1" }}>
              <WeeklyTrendsCard entityId={entityId} branchId={branchId} from={from} to={to} />
            </Box>
            {/* <Box>
              <CostVsBudgetCard entityId={entityId} branchId={branchId} from={from} to={to} />
            </Box> */}
          </GridLayout>
        ),
      },
      {
        id: "salary",
        label: t("tabs.salaryEstimation"),
        content: (
          <GridLayout>
            <Box sx={{ gridColumn: "1 / -1" }}>
              <SalaryEstimateCard entityId={entityId} branchId={branchId} from={from} to={to} />
            </Box>
          </GridLayout>
        ),
      },
      {
        id: "compliance",
        label: t("tabs.compliance"),
        content: (
          <GridLayout>
            <Box sx={{ gridColumn: "1 / -1" }}>
              <SuspectRatesCard entityId={entityId} branchId={branchId} from={from} to={to} />
            </Box>
            <Box sx={{ gridColumn: "1 / -1" }}>
              <PunctualityCard entityId={entityId} branchId={branchId} from={from} to={to} />
            </Box>
            <Box>
              <StartEndTimesCard entityId={entityId} branchId={branchId} from={from} to={to} />
            </Box>
            <Box>
              <GeoComplianceCard entityId={entityId} branchId={branchId} from={from} to={to} />
            </Box>
            <Box>
              <ShiftComplianceCard entityId={entityId} branchId={branchId} from={from} to={to} />
            </Box>
          </GridLayout>
        ),
      },
      {
        id: "time",
        label: t("tabs.time"),
        content: (
          <GridLayout>
            <Box sx={{ gridColumn: "1 / -1" }}>
              <ExtraHoursCard entityId={entityId} branchId={branchId} from={from} to={to} />
            </Box>
            <Box sx={{ gridColumn: "1 / -1" }}>
              <HourlyDistributionCard entityId={entityId} branchId={branchId} from={from} to={to} />
            </Box>
          </GridLayout>
        ),
      },
    ],
    [branchId, entityId, from, t, to]
  );

  return (
    <GenericTabs
      tabs={tabs}
      fullWidth       
      sx={{ width: "100%" }}
      syncUrl={false}
    />
  );
};
