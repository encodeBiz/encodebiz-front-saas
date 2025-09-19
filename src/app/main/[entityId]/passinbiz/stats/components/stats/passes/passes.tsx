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


export default function PassesStats() {
  const t = useTranslations();
  const { payloadPassIssued } = usePassinBizStats()
  return (
    <Container maxWidth="lg" >


      <BorderBox sx={{ width: "100%", height: 200, p: 2, mt: 2, mb: 2, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
        Grafica de tendencia aqui
      </BorderBox>

      <HelpTabs tabs={[
        {
          id: '1',
          title: 'Pases emitidos',
          tabContent: <Box sx={{ width: "100%", p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

            <PassIssuedFilter />

            <BorderBox sx={{ width: "100%", p: 2, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
              <PassesIssuedChart />
            </BorderBox>


            {payloadPassIssued.type === 'event' && <BorderBox sx={{ width: "100%", p: 2, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
              <PassesIssuedRankingChart />
            </BorderBox>}


          </Box>
        },

        {
          id: '2',
          title: 'Pases validados',
          tabContent: <Box sx={{ width: "100%", p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <PassValidatorFilter />
            <BorderBox sx={{ width: "100%", p: 2, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
              <PassesValidationChart />
            </BorderBox>
            {payloadPassIssued.type === 'event' && <BorderBox sx={{ width: "100%", p: 2, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
              <PassesValidationRankingChart />
            </BorderBox>}


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
