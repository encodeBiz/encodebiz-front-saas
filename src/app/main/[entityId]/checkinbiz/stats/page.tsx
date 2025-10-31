'use client';
import { Alert, Box, Container, Typography } from '@mui/material';
import { useTranslations } from "next-intl";

import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { CheckBizStatsProvider, useCheckBizStats, } from './context/checkBizStatsContext';
import { SelectorBranch } from './components/Selector';
import { StatsPattern } from './components/Stats';
import BoxLoader from '@/components/common/BoxLoader';
import { HeuristicAnalize } from './components/HeuristicAnalize/HeuristicAnalize';
import { SelectorIndicator } from './components/SelectorIndicator';


const Stats = () => {
  const t = useTranslations();
  const { pending, branchOne, branchTwo, heuristicDataOne, heuristicDataTwo } = useCheckBizStats()


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
        {pending && <BoxLoader message={t('statsCheckbiz.loading')} />}
        {!pending && branchOne && <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }} p={2}>
          <Typography variant='h6' sx={{ width: '100%' }}>{t('statsCheckbiz.operationData')}</Typography>
          <StatsPattern />
        </Box>}

        {!pending && heuristicDataOne.length > 0 && <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }} p={2}>
          <Box display={'flex'} justifyContent={'space-between'} alignItems='center' gap={2} sx={{ width: '100%' }}>
            <Typography variant='h6' sx={{ width: '100%' }}>{t('statsCheckbiz.heuristicAnalize')}</Typography>
            <SelectorIndicator />
          </Box>
          <Box display={'flex'} justifyContent={'space-between'} alignItems='center' gap={2} sx={{ width: '100%' }}>
            {heuristicDataOne.length > 0 && branchOne && <HeuristicAnalize branchPattern={branchOne} data={heuristicDataOne} />}
            {heuristicDataTwo.length > 0 && branchTwo && <HeuristicAnalize branchPattern={branchTwo} data={heuristicDataTwo} />}
          </Box>
        </Box>}

        {!pending && !branchOne && <Box sx={{ maxWidth: 400, m: 'auto', my: 5 }}><Alert severity="warning">{t('statsCheckbiz.advise')}</Alert></Box>}

      </HeaderPage>
    </Container>

  );
}

const StatsPage = () => <CheckBizStatsProvider><Stats /></CheckBizStatsProvider>

export default StatsPage