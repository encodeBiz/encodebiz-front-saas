'use client';

import { Box } from "@mui/material";
import { CheckbizCardProps } from "./cards/types";
import { CostByBranchCard } from "./cards/CostByBranchCard";
import { HoursByBranchCard } from "./cards/HoursByBranchCard";
import { CostPerHourCard } from "./cards/CostPerHourCard";
import { CostVsBudgetCard } from "./cards/CostVsBudgetCard";
import { SuspectRatesCard } from "./cards/SuspectRatesCard";
import { StartEndTimesCard } from "./cards/StartEndTimesCard";
import { GeoComplianceCard } from "./cards/GeoComplianceCard";
import { AbsenteeismCard } from "./cards/AbsenteeismCard";
import { PunctualityCard } from "./cards/PunctualityCard";
import { ExtraHoursCard } from "./cards/ExtraHoursCard";
import { ShiftComplianceCard } from "./cards/ShiftComplianceCard";
import { WeeklyTrendsCard } from "./cards/WeeklyTrendsCard";
import { EmployeeProductivityCard } from "./cards/EmployeeProductivityCard";
import { BranchRankingCard } from "./cards/BranchRankingCard";
import { HourlyDistributionCard } from "./cards/HourlyDistributionCard";

interface DashboardProps extends CheckbizCardProps {
  topN?: number;
}

export const CheckbizStatsDashboard = ({
  entityId,
  branchId,
  from,
  to,
  topN = 5,
}: DashboardProps) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
      gap: 3,
      width: "100%",
    }}
  >
    <Box sx={{ gridColumn: "1 / -1" }}>
      <CostByBranchCard entityId={entityId} branchId={branchId} from={from} to={to} />
    </Box>
    <Box>
      <HoursByBranchCard entityId={entityId} branchId={branchId} from={from} to={to} />
    </Box>
    <Box>
      <CostPerHourCard entityId={entityId} branchId={branchId} from={from} to={to} />
    </Box>
    {/* <Box>
      <CostVsBudgetCard entityId={entityId} branchId={branchId} from={from} to={to} />
    </Box> */}
    {/* <Box>
      <WeeklyTrendsCard entityId={entityId} branchId={branchId} from={from} to={to} />
    </Box> */}
    <Box sx={{ gridColumn: "1 / -1" }}>
      <SuspectRatesCard entityId={entityId} branchId={branchId} from={from} to={to} />
    </Box>
    <Box>
      <WeeklyTrendsCard entityId={entityId} branchId={branchId} from={from} to={to} />
    </Box>
    <Box>
      <PunctualityCard entityId={entityId} branchId={branchId} from={from} to={to} />
    </Box>
    <Box>
      <ExtraHoursCard entityId={entityId} branchId={branchId} from={from} to={to} />
    </Box>
    <Box>
      <StartEndTimesCard entityId={entityId} branchId={branchId} from={from} to={to} />
    </Box>
    <Box>
      <GeoComplianceCard entityId={entityId} branchId={branchId} from={from} to={to} />
    </Box>
    <Box>
      <AbsenteeismCard entityId={entityId} branchId={branchId} from={from} to={to} />
    </Box>
    <Box>
      <ShiftComplianceCard entityId={entityId} branchId={branchId} from={from} to={to} />
    </Box>
    <Box>
      <EmployeeProductivityCard
        entityId={entityId}
        branchId={branchId}
        from={from}
        to={to}
        topN={topN}
      />
    </Box>
    {/* <Box>
      <BranchRankingCard entityId={entityId} branchId={branchId} from={from} to={to} topN={topN} />
    </Box> */}
    <Box sx={{ gridColumn: "1 / -1" }}>
      <HourlyDistributionCard entityId={entityId} branchId={branchId} from={from} to={to} />
    </Box>
  </Box>
);
