'use client';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import HelpTabs from '@/components/features/dashboard/HelpTabs/HelpTabs';
import { Box, Container } from '@mui/material';
import { useTranslations } from "next-intl";
import { PassesIssuedChart } from '../../charts/passesIssued/passesIssued';
import { PassesIssuedRankingChart } from '../../charts/passesIssued/passesIssuedRanking';
import { PassIssuedFilter } from '../../filters/PassIssuedFilter';
import { usePassinBizStats } from '../../../context/passBizStatsContext';
import { PassesValidationChart } from '../../charts/passesValidation/passesValidation';
import { PassValidatorFilter } from '../../filters/PassValidatorFilter';
import { PassesValidationRankingChart } from '../../charts/passesValidation/passesValidationRanking';
import { PassesTrendChart } from '../../charts/passesTrend/passesTrend';
import EmptyState from '@/components/common/EmptyState/EmptyState';


export default function PassesStats() {
  const t = useTranslations();
  const { payloadPassIssued, payloadPassValidatorFilter, payloadPassIssuedFilter } = usePassinBizStats()
  return (
    <Container maxWidth="lg" >


      <BorderBox sx={{ width: "100%", p: 2, mt: 2, mb: 2, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
        <PassesTrendChart />
      </BorderBox>

      <HelpTabs tabs={[
        {
          id: '1',
          title: 'Pases emitidos',
          tabContent: <Box sx={{ width: "100%", p: 2, display: 'flex', flexDirection: 'column', gap: 2,pb:4 }}>

            <PassIssuedFilter />
            {payloadPassIssuedFilter ? <>
              <BorderBox sx={{ width: "100%", p: 2, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
                <PassesIssuedChart />
              </BorderBox>


              {payloadPassIssued.type === 'event' && <BorderBox sx={{ width: "100%", p: 2, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
                <PassesIssuedRankingChart />
              </BorderBox>}
            </> : <>
              <EmptyState showIcon={false}
                title={t('stats.empthy')}
                description={t('stats.empthytext')}
              />
            </>}



          </Box>
        },

        {
          id: '2',
          title: 'Pases validados',
          tabContent: <Box sx={{ width: "100%", p: 2, display: 'flex', flexDirection: 'column', gap: 2 ,pb:4}}>
            <PassValidatorFilter />
            {payloadPassValidatorFilter ? <>
              <BorderBox sx={{ width: "100%", p: 2, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
                <PassesValidationChart />
              </BorderBox>
              {payloadPassIssued.type === 'event' && <BorderBox sx={{ width: "100%", p: 2, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
                <PassesValidationRankingChart />
              </BorderBox>}
            </> : <>
              <EmptyState showIcon={false}
                title={t('stats.empthy')}
                description={t('stats.empthytext')}
              />
            </>}

          </Box>
        },


      ]} />

      {/** 
      <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>

          <Box mt={2} display={'flex'} flexWrap={'wrap'} flexDirection={{ xs: "column", md: "row" }} gap={4}>
            <BorderBox sx={{ width: "45%", p: 2, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
              <PassesIssuedChart payload={filter} type='PASSES_ISSUED' />
            </BorderBox>

            {payload.type === 'event' && <BorderBox sx={{ width: "45%", p: 2, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
              <PassesIssuedRankingChart payload={filter} type='PASSES_ISSUED' />
            </BorderBox>}

            <BorderBox sx={{ width: "45%", p: 2, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
              <PassesValidationChart payload={filter} type='PASSES_VALIDATION' />
            </BorderBox>



            {payload.type === 'event' && <BorderBox sx={{ width: "45%", p: 2, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
              <PassesIssuedRankingChart payload={filter} type='PASSES_VALIDATION' />
            </BorderBox>}

          </Box>
        </Box>
      </Box>
      */}


    </Container>
  );
}
