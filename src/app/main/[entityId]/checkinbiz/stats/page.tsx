'use client';
import { Box, Container, IconButton, Popover, Typography } from '@mui/material';
import { useTranslations } from "next-intl";

import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { CheckBizStatsProvider, useCheckBizStats, } from './context/checkBizStatsContext';
import { SelectorBranch } from './components/Selector';
import { StatsPattern } from './components/Stats';
import BoxLoader from '@/components/common/BoxLoader';
import { HeuristicAnalize } from './components/HeuristicAnalize/HeuristicAnalize';
import { SelectorIndicator } from './components/SelectorIndicator';
import React from 'react';
import { SettingsOutlined } from '@mui/icons-material';
import { SelectorCard } from './components/SelectorCard';
import { SelectorChart } from './components/SelectorChart';


const Stats = () => {
  const t = useTranslations();
  const { pending, branchOne, heuristicAnalizeError, branchTwo, heuristicDataOne, heuristicDataTwo } = useCheckBizStats()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


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
          <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
            <Box>
              <Typography variant='h6' sx={{ width: '100%' }}>{t('statsCheckbiz.operationData')}</Typography>
            </Box>
            <Box>
              <IconButton onClick={handleClick}><SettingsOutlined sx={{fontSize:40}} color='primary' /></IconButton>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <Box display={'flex'} flexDirection={'column'} gap={4} padding={4}>
                  <SelectorCard />
                  <SelectorIndicator />
                  <SelectorChart />
                </Box>
              </Popover>
            </Box>
          </Box>
          <StatsPattern />
        </Box>}

        <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
          {!pending && <Box display={'flex'} justifyContent={'space-between'} alignItems='center' gap={2} sx={{ width: '100%' }} p={2}>
            <Typography variant='h6' sx={{ width: '100%' }}>{t('statsCheckbiz.heuristicAnalize')}</Typography>
          </Box>}


          {!pending && heuristicAnalizeError && <Box display={'flex'} justifyContent={'center'} alignItems={'center'} p={2} pb={4} textAlign={'center'}  sx={{ width: '60%', margin:'auto' }}>
            <Typography variant='body1' color='textSecondary'>
              {heuristicAnalizeError}
            </Typography>
          </Box>}
          {!pending && heuristicDataOne.length > 0 && <Box display={'flex'} justifyContent={'space-between'} alignItems='center' gap={2} sx={{ width: '100%' }}>


            {heuristicDataOne.length > 0 && branchOne && !heuristicAnalizeError && <HeuristicAnalize branchPattern={branchOne} data={heuristicDataOne} />}
            {heuristicDataTwo.length > 0 && branchTwo && !heuristicAnalizeError && <HeuristicAnalize branchPattern={branchTwo} data={heuristicDataTwo} />}
          </Box>}
        </Box>


      </HeaderPage>
    </Container>

  );
}

const StatsPage = () => <CheckBizStatsProvider><Stats /></CheckBizStatsProvider>

export default StatsPage