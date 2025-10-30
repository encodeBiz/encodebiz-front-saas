'use client';
import { Box, Container, Typography } from '@mui/material';
import { useTranslations } from "next-intl";

import HeaderPage from '@/components/features/dashboard/HeaderPage/HeaderPage';
import { CheckBizStatsProvider, } from './context/checkBizStatsContext';
import { SelectorBranch } from './components/Selector';
import { StatsPattern } from './components/Stats';


export default function Stats() {
  const t = useTranslations();

  return (
    <CheckBizStatsProvider>
      <Container maxWidth="lg">
        <HeaderPage
          title={t("layout.side.menu.Stats")}
          actions={
            <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
              <SelectorBranch />
            </Box>
          }
        >

          <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            <Typography>Operational Open Data</Typography>
            <StatsPattern />
          </Box>

        </HeaderPage>
      </Container>
    </CheckBizStatsProvider>
  );
}
