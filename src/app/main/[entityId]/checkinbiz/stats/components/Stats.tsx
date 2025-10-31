'use client';
import { Box } from '@mui/material';
 
import {  useCheckBizStats } from '../context/checkBizStatsContext';
import { StatsPatternCards } from './StatsPattern/StatsPattern';
 
export const StatsPattern = () => {
     const { branchOne, branchTwo } = useCheckBizStats()
     
 
    return (
        <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }} p={2}>
          
            {branchOne && <StatsPatternCards data={branchOne} />}
            {branchTwo && <StatsPatternCards data={branchTwo} />}
        </Box>
    );
}


 