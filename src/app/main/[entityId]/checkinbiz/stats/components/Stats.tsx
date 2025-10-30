'use client';
import { Box } from '@mui/material';
import { useTranslations } from "next-intl";

import { CheckBizStatsProvider, useCheckBizStats } from '../context/checkBizStatsContext';
import { StatsPatternCards } from './StatsPattern/StatsPattern';

const StatsComponnet = () => {
     const { branchOne, branchTwo } = useCheckBizStats()

    return (
        <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            {branchOne && <StatsPatternCards data={branchOne} />}

            {branchTwo && <StatsPatternCards data={branchTwo} />}
        </Box>
    );
}


export const StatsPattern = () => <CheckBizStatsProvider><StatsComponnet /></CheckBizStatsProvider>