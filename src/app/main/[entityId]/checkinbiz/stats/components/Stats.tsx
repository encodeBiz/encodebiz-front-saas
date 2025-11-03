'use client';
import { Box } from '@mui/material';

import { useCheckBizStats } from '../context/checkBizStatsContext';
import { StatsPatternCards } from './StatsPattern/StatsPattern';
import Chart from './Chart';
 
export const StatsPattern = () => {
    const { branchOne, branchTwo } = useCheckBizStats()


    return (

        <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-start' gap={2} sx={{ width: '100%' }}>
            <Box display={'flex'} justifyContent={'flex-start'} flexDirection={'column'} alignItems='flex-start' gap={2} sx={{ width: '100%' }} p={2}>
              
                <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-start' gap={2} sx={{ width: '100%' }} p={2}>
                    {branchOne && <StatsPatternCards lineal={!!branchTwo} data={branchOne} />}
                    {branchTwo && <StatsPatternCards lineal={!!branchTwo} data={branchTwo} />}
                </Box>
            </Box>
            {branchOne && <Box display={'flex'} flexDirection={'column'} gap={2} minWidth={'50%'} flex={1}>
                <Chart />
            </Box>}
        </Box>

    );
}


