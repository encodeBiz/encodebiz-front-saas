'use client';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import HelpTabs from '@/components/features/dashboard/HelpTabs/HelpTabs';
import { Box, Container, Stack } from '@mui/material';
import { useTranslations } from "next-intl";
import { PassesIssuedChart } from '../../charts/passesIssued/passesIssued';
import { PassesIssuedRankingChart } from '../../charts/passesIssuedRanking/passesIssuedRanking';
import { DateRangePicker } from '../../filters/DateRangeFilter';
import { EventFilter } from '../../filters/EventFilter';
import { GroupByFilter } from '../../filters/GroupByFilter';
import { TypeFilter } from '../../filters/TypeFilter';
import PassesStatsController from './passes.controller';
 

export default function PassesStats() {
  const t = useTranslations();
  const {
    setPayload, payload,
    setFilter, filter,
  } = PassesStatsController();

  return (
    <Container maxWidth="lg">
    
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
 
    </Container>
  );
}
