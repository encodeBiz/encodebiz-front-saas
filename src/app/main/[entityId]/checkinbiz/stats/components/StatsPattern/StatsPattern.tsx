'use client';
import { Box, Typography } from '@mui/material';

import { BorderBox } from '@/components/common/tabs/BorderBox';
import { IBranchPattern } from '@/domain/features/checkinbiz/IStats';
import { AccessTimeOutlined } from '@mui/icons-material';

export const StatsPatternCards = ({ data }: { data: IBranchPattern }) => {
 
    return (
        <Box display={'flex'} justifyContent={'flex-end'} alignItems='flex-end' gap={2} sx={{ width: '100%' }}>
            <BorderBox sx={{ padding: 2 }}>
                <Box display={'flex'} flexDirection={'row'}>
                    <AccessTimeOutlined />
                    <Box display={'flex'} flexDirection={'column'}>
                        <Typography>Avg Start/End Hour</Typography>
                        <Typography>Avg Start/End Hour</Typography>

                    </Box>
                </Box>

            </BorderBox>

            <BorderBox sx={{ padding: 2 }}>

            </BorderBox>
        </Box>
    );
}


