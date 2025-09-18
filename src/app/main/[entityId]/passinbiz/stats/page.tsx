'use client';
import { Box, Container, Stack } from '@mui/material';
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
import { SassButton } from '@/components/common/buttons/GenericButton';
import HelpTabs from '@/components/features/dashboard/HelpTabs/HelpTabs';

export default function HolderList() {
  const t = useTranslations();
  const {
    setPayload, payload,
    setFilter, filter,



  } = useHolderListController();

  return (
    <Container maxWidth="lg">
      <HeaderPage
        title={t("layout.side.menu.Stats")}

      >
        <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Stack direction={{ xs: "column", md: "row" }} gap={2} spacing={2} alignItems={{ md: "flex-end" }} justifyContent="flex-end" sx={{ mb: 2 }}>

              <Stack flexWrap={'wrap'} direction={{ xs: "column", md: "row" }} spacing={2} >
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

                <SassButton variant='contained' color='primary' size='small' onClick={() => setFilter({ ...payload })}>{t('core.button.applyFilter')}</SassButton>
              </Stack>
            </Stack>

            <Box display={'flex'} flexWrap={'wrap'} flexDirection={{ xs: "column", md: "row" }} gap={4}>
              <BorderBox sx={{ width: "100%" }}>
                <HelpTabs tabs={[
                  {
                    id: '1',
                    title: t('stats.passesIssued'),
                    description: t('stats.passesIssuedText'),
                    tabContent: <PassesIssuedChart payload={filter} type='PASSES_ISSUED' />
                  },
                  ...payload.type === 'event' ? [
                    {
                      id: '2',
                      title: t('stats.passesIssuedRank'),
                      tabContent: <PassesIssuedRankingChart payload={filter} type='PASSES_ISSUED' />
                    }
                  ] : [],
                  {
                    id: '3',
                    title: t('stats.passesValidation'),
                    description: t('stats.passesIssuedText'),
                    tabContent: <PassesIssuedChart payload={filter} type='PASSES_VALIDATION' />
                  },
                  ...payload.type === 'event' ? [
                    {
                      id: '4',
                      title: t('stats.passesValidationRank'),
                      tabContent: <PassesIssuedRankingChart payload={filter} type='PASSES_VALIDATION' />
                    }
                  ] : []

                ]} />
              </BorderBox>


            </Box>


          </Box>
        </Box>

      </HeaderPage>
    </Container>
  );
}
