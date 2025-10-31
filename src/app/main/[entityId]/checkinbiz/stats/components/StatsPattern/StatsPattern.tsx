'use client';
import { Box, Typography } from '@mui/material';

import { BorderBox } from '@/components/common/tabs/BorderBox';
import { IBranchPattern } from '@/domain/features/checkinbiz/IStats';
import { AccessTimeOutlined } from '@mui/icons-material';
import { formatDay } from '@/lib/common/Date';

export const StatsPatternCards = ({ data }: { data: IBranchPattern }) => {

    return (
        <Box display={'flex'}   gap={2} sx={{ width: '100%' }}>

            <Box display={'flex'} flexDirection={'column'}  gap={2}>
                <BorderBox sx={{ padding: 2 }}>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={2}>
                        <AccessTimeOutlined style={{ fontSize: 40 }} />
                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography sx={{ fontSize: 20 }}>Avg Start/End Hour</Typography>
                            <Typography sx={{ fontSize: 20 }}>{`${formatDay(Math.floor(data.avgStartHour))}:00 -> ${formatDay(Math.floor(data.avgEndHour))}:00`}</Typography>
                        </Box>
                    </Box>
                </BorderBox>

                <BorderBox sx={{ padding: 2 }}>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={2}>
                        <AccessTimeOutlined style={{ fontSize: 40 }} />
                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography sx={{ fontSize: 20 }}>Avg Cost Per Hour</Typography>
                            <Typography sx={{ fontSize: 20 }}>{`${(Math.floor(data.dataPoints))}`}</Typography>
                        </Box>
                    </Box>
                </BorderBox>

                <BorderBox sx={{ padding: 2 }}>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={2}>
                        <AccessTimeOutlined style={{ fontSize: 40 }} />
                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography sx={{ fontSize: 20 }}>Avg Cost Per Cycle</Typography>
                            <Typography sx={{ fontSize: 20 }}>{`${(Math.floor(data.dataPoints))}`}</Typography>
                        </Box>
                    </Box>
                </BorderBox>
            </Box>

            <Box display={'flex'} flexDirection={'column'}  gap={2}>
                <BorderBox sx={{ padding: 2 }}>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={2}>
                        <AccessTimeOutlined style={{ fontSize: 40 }} />
                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography sx={{ fontSize: 20 }}>Avg Start/End Hour</Typography>
                            <Typography sx={{ fontSize: 20 }}>{`${formatDay(Math.floor(data.avgStartHour))}:00 -> ${formatDay(Math.floor(data.avgEndHour))}:00`}</Typography>
                        </Box>
                    </Box>
                </BorderBox>

                <BorderBox sx={{ padding: 2 }}>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems={'center'} gap={2}>
                        <AccessTimeOutlined style={{ fontSize: 40 }} />
                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography sx={{ fontSize: 20 }}>Avg Cost Per Hour</Typography>
                            <Typography sx={{ fontSize: 20 }}>{`${(Math.floor(data.dataPoints))}`}</Typography>
                        </Box>
                    </Box>
                </BorderBox>

                
            </Box>
        </Box>
    );
}


