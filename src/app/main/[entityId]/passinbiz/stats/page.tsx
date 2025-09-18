'use client';
import { Box, Container, Stack, Typography } from '@mui/material';
import { useTranslations } from "next-intl";
import useHolderListController from './page.controller';

import { useCommonModal } from '@/hooks/useCommonModal';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { useLayout } from '@/hooks/useLayout';
import { PassesIssuedRankingChart } from './components/charts/passesIssuedRanking';
import { PassesIssuedChart } from './components/charts/passesIssued';
import { EventFilter } from './components/filters/EventFilter';
import { GroupByFilter } from './components/filters/GroupByFilter';
import { TypeFilter } from './components/filters/TypeFilter';
import { BorderBox } from '@/components/common/tabs/BorderBox';

export default function HolderList() {
  const t = useTranslations();
  const {
    setPayload, payload,
    type, setType,
    groupBy, setGroupBy,
    eventList, evenDataList, setEventDataList, setEventList,
    handleFetchStats, loading, graphData,
    tab, setTab,

  } = useHolderListController();
  const { open } = useCommonModal()
  const { navivateTo } = useLayout()
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
                <TypeFilter value={type} onChange={(type) => {
                  setPayload({ ...payload, type })
                  setType(type)
                  handleFetchStats({ ...payload, type })
                }} />
                {/** <DateRangePicker value={dateRange} onChange={setDateRange} />*/}
                <GroupByFilter
                  value={groupBy}
                  onChange={(groupBy) => {
                    setPayload({ ...payload, groupBy })
                    setGroupBy(groupBy)
                    handleFetchStats({ ...payload, groupBy })
                  }} />
                {type === 'event' && <EventFilter
                  value={eventList}
                  onChange={setEventList}
                  onChangeData={(events) => {
                    setPayload({ ...payload, events })
                    setEventDataList(events)
                    handleFetchStats({ ...payload, events })
                  }} />}

              </Stack>
            </Stack>

            <Box display={'flex'} flexWrap={'wrap'} flexDirection={{ xs: "column", md: "row" }} gap={4}>
              <BorderBox sx={{ p: 1, width: '100%' }}>
                <PassesIssuedChart graphData={graphData} pending={loading} evenDataList={evenDataList} />
              </BorderBox>
              {type === 'event' && <BorderBox sx={{ p: 1, width: '100%' }}><PassesIssuedRankingChart graphData={graphData} pending={loading} /></BorderBox>}
            </Box>


          </Box>
        </Box>

      </HeaderPage>
    </Container>
  );
}
