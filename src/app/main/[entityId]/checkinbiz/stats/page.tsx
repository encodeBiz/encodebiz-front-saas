'use client';
import { Box, Container, Typography } from '@mui/material';
import { useTranslations } from "next-intl";

import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { CheckBizStatsProvider, useCheckBizStats, } from './context/checkBizStatsContext';
import { SelectorBranch } from './components/Selector';
import { StatsPattern } from './components/Stats';


const Stats = () => {
  const t = useTranslations();
 
     
     
  return (

    <Container maxWidth="lg">
      <HeaderPage
        title={t("layout.side.menu.Stats")}
        actions={
          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            <SelectorBranch />
          </Box>
        }
      >
 
        <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }} p={2}>
          <Typography variant='h6' sx={{ width: '100%' }}>Operational Open Data</Typography>
          <StatsPattern />
        </Box>

      </HeaderPage>
    </Container>

  );
}

const StatsPage = () => <CheckBizStatsProvider><Stats /></CheckBizStatsProvider>

export default StatsPage