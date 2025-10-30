'use client';
import { Box } from '@mui/material';

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
                         
                    </Box>
                </Box>
               
            </BorderBox>

            <BorderBox sx={{ padding: 2 }}>
                {JSON.stringify(data)}
            </BorderBox>
        </Box>
    );
}


