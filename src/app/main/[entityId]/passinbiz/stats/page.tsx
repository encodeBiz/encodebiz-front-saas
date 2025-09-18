'use client';
import { Box, Container, Stack, Typography } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderListController from './page.controller';

import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { PassesIssuedRankingChart } from './components/charts/passesIssuedRanking/passesIssuedRanking';
import { PassesIssuedChart } from './components/charts/passesIssued/passesIssued';
import { EventFilter } from './components/filters/EventFilter';
import { GroupByFilter } from './components/filters/GroupByFilter';
import { TypeFilter } from './components/filters/TypeFilter';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { DateRangePicker } from './components/filters/DateRangeFilter';

export default function HolderList() {
  const t = useTranslations();
  const {
    setPayload, payload,



  } = useHolderListController();

  return (
    <Container maxWidth="lg">
      <HeaderPage
        title={t("layout.side.menu.Stats")}

      >
        <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "flex-end" }} justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography>Filtros:</Typography>
              <Stack direction="row" spacing={2}>
                <TypeFilter value={payload.type} onChange={(type) => {
                  setPayload({ ...payload, type, events: type === 'credential' ? [] : payload.events })

                }} />
                <DateRangePicker value={payload.dateRange} onChange={(dateRange) => setPayload({ ...payload, dateRange })} />
                <GroupByFilter
                  value={payload.groupBy}
                  onChange={(groupBy) => {
                    setPayload({ ...payload, groupBy })
                  }} />
                {payload.type === 'event' && <EventFilter
                  value={payload.events?.map(e => e.id) ?? []}
                  onChangeData={(events) => {
                    setPayload({ ...payload, events })
                  }} />}

              </Stack>
            </Stack>

            <Box display={'flex'} flexWrap={'wrap'} flexDirection={{ xs: "column", md: "row" }} gap={4}>
              <BorderBox sx={{ p: 1, width: '100%' }}>
                <PassesIssuedChart payload={payload} />
              </BorderBox>
              {payload.type === 'event' && <BorderBox sx={{ p: 1, width: '100%' }}><PassesIssuedRankingChart payload={payload} /></BorderBox>}
            </Box>


          </Box>
        </Box>

      </HeaderPage>
    </Container>
  );
}
