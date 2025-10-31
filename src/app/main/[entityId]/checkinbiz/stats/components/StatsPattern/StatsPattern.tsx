'use client';
import { Box, Typography } from '@mui/material';

import { BorderBox } from '@/components/common/tabs/BorderBox';
import { IBranchPattern } from '@/domain/features/checkinbiz/IStats';
import { AccessTimeOutlined, CurrencyExchangeOutlined, PendingActionsOutlined } from '@mui/icons-material';
import { formatDay } from '@/lib/common/Date';
import { useTranslations } from 'next-intl';
import { getAverage } from '@/lib/common/String';
import Chart from '../Chart';

export const StatsPatternCards = ({ data, lineal = false, chart = false }: { data: IBranchPattern, lineal?: boolean, chart?: boolean }) => {
    const t = useTranslations()

    return (
        <Box display={'flex'} flexDirection={'column'} gap={2} sx={{ width: '100%' }}>
            <Typography fontWeight={'bold'} variant='body2'>{data.branch?.name}</Typography>
            <Box display={'flex'} flexDirection={'row'} gap={2} sx={{ width: '100%' }}>
                <Box display={'flex'} flexDirection={lineal ? 'column' : 'row'} gap={2} sx={{ width: '100%' }}>
                    <Box display={'flex'} flexDirection={'column'} gap={2}>
                        <BorderBox sx={{ padding: 2 }}>
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
                                <AccessTimeOutlined style={{ fontSize: 40 }} />
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Typography sx={{ fontSize: 20 }}>{t('statsCheckbiz.avgStartEnd')}</Typography>
                                    <Typography sx={{ fontSize: 22 }}>{`${formatDay(Math.floor(getAverage(data.weeklyStartAvg as Array<number>)))}:00 -> ${formatDay(Math.floor(getAverage(data.weeklyEndAvg as Array<number>)))}:00`}</Typography>
                                </Box>
                            </Box>
                        </BorderBox>

                        <BorderBox sx={{ padding: 2 }}>
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
                                <PendingActionsOutlined style={{ fontSize: 40 }} />
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Typography sx={{ fontSize: 20 }}>{t('statsCheckbiz.avgCostHour')}</Typography>
                                    <Typography sx={{ fontSize: 22 }}>{`${(Math.floor(data.avgCostHour ?? 0))} €`}</Typography>
                                </Box>
                            </Box>
                        </BorderBox>

                        <BorderBox sx={{ padding: 2 }}>
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
                                <CurrencyExchangeOutlined style={{ fontSize: 40 }} />
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Typography sx={{ fontSize: 20 }}>{t('statsCheckbiz.avgCycleCost')}</Typography>
                                    <Typography sx={{ fontSize: 22 }}>{`${(Math.floor(data.avgCycleCost ?? 0))} €`}</Typography>
                                </Box>
                            </Box>
                        </BorderBox>
                    </Box>

                    <Box display={'flex'} flexDirection={'column'} gap={2}>
                        <BorderBox sx={{ padding: 2 }}>
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Typography sx={{ fontSize: 20 }}>{t('statsCheckbiz.avgWeekWork')}</Typography>
                                    <Typography fontWeight={'bold'} sx={{ fontSize: 25 }}>{`${getAverage(data.weeklyWorkAvg as Array<number>).toFixed(1)} h`}</Typography>
                                </Box>
                            </Box>
                        </BorderBox>

                        <BorderBox sx={{ padding: 2 }}>
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Typography sx={{ fontSize: 20 }}>{t('statsCheckbiz.rentability')}</Typography>
                                    <Typography fontWeight={'bold'} sx={{ fontSize: 25 }}>{`${((data.reliability ?? 0)?.toFixed(2))}`}</Typography>
                                </Box>
                            </Box>
                        </BorderBox>
                    </Box>
                </Box>

                {chart && <Box display={'flex'} flexDirection={'column'} gap={2} minWidth={'50%'} flex={1}>
                    <Chart />
                </Box>}
            </Box>
        </Box>
    );
}


