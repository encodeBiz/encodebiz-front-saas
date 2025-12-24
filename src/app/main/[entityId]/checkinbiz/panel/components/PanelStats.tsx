import BoxLoader from "@/components/common/BoxLoader";
import HeaderPage from "@/components/features/dashboard/HeaderPage/HeaderPage";
import { Box, Typography, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useDashboard } from "../context/dashboardContext";
import { useEntity } from "@/hooks/useEntity";
import EmptyList from "@/components/common/EmptyState/EmptyList";
import emptyImage from "../../../../../../../public/assets/images/empty/datos.svg";
import dayjs from "dayjs";
import { CheckbizStatsDashboard } from "./statsDashboard";
import { DateRangeFilter } from "./statsDashboard/DateRangeFilter";

export const PanelStats = () => {
  const t = useTranslations();
  const { pending, branchList, initialize } = useDashboard();
  const { currentEntity } = useEntity();
  const [dateRange, setDateRange] = useState(() => ({
    from: dayjs().startOf("month").toISOString(),
    to: dayjs().endOf("day").toISOString(),
  }));

  useEffect(() => {
    if (currentEntity?.entity?.id) {
      initialize();
    }
  }, [currentEntity?.entity?.id, initialize]);

  const InnetContent = () => (
    <Box sx={{ minHeight: 600 }}>
      {pending && <BoxLoader message={t("statsCheckbiz.loading")} />}

      {!pending && currentEntity?.entity?.id && branchList.length > 0 && (
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
            justifyContent="flex-end"
            sx={{ width: "100%", pr: { xs: 0, md: 1 }, mt: { xs: 0, md: 1 } }}
          >
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
          </Stack>
        <CheckbizStatsDashboard
            entityId={currentEntity.entity.id}
            branchId={undefined}
            from={dateRange.from}
            to={dateRange.to}
            topN={5}
          />
        </Box>
      )}

      {branchList.length === 0 && !pending && (
        <EmptyList
          imageUrl={emptyImage}
          title={t("employeeDashboard.panelNoDataTitle")}
          description={t("employeeDashboard.panelNoDataText")}
        />
      )}
    </Box>
  );

  return (
    <Box width="100%" sx={{py: { xs: 2, md: 3 } }}>
      <HeaderPage
        title={
          <Box display="flex" gap={0.2} justifyItems="center" alignItems="center">
            <Typography align="center" sx={{ mb: 0, textAlign: "left", fontSize: 32 }}>
              {t("statsCheckbiz.stats")}
            </Typography>
          </Box>
        }
      >
        <InnetContent />
      </HeaderPage>
    </Box>
  );
};
