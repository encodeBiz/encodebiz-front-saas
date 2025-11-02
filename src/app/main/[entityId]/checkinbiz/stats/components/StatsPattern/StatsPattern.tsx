'use client';
import { Box, Divider, Tooltip, Typography } from '@mui/material';

import { BorderBox } from '@/components/common/tabs/BorderBox';
import { IBranchPattern } from '@/domain/features/checkinbiz/IStats';
import { AccessTimeOutlined, CurrencyExchangeOutlined, HelpOutline, PendingActionsOutlined, Preview, Snowing } from '@mui/icons-material';
import { formatDay } from '@/lib/common/Date';
import { useTranslations } from 'next-intl';
import { getAverage } from '@/lib/common/String';
import { useCheckBizStats } from '../../context/checkBizStatsContext';

export const StatsPatternCards = ({ data, lineal = false }: { data: IBranchPattern, lineal?: boolean }) => {
    const t = useTranslations()
    const { cardIndicatorSelected } = useCheckBizStats()

    return (
        <Box display={'flex'} flexDirection={'column'} gap={2} sx={{ width: '100%' }}>
            <Typography fontSize={22} fontWeight={'bold'} variant='body2' color='textSecondary'>{data.branch?.name}</Typography>
            <Divider />
            <Box display={'flex'} flexDirection={'row'} gap={2} sx={{ width: '100%' }}>
                <Box display={'flex'} flexDirection={lineal ? 'column' : 'row'} gap={2} sx={{ width: '100%' }}>
                    <Box display={'flex'} flexDirection={'column'} gap={2}>
                        {cardIndicatorSelected.includes('avgStartEnd') && <BorderBox sx={{ padding: 2, position: 'relative' }}>
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
                                <AccessTimeOutlined style={{ fontSize: 40 }} />
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Typography sx={{ fontSize: 20 }}>{t('statsCheckbiz.avgStartEnd')}</Typography>
                                    <Typography sx={{ fontSize: 22 }}>{`${formatDay(Math.floor(getAverage(data.weeklyStartAvg as Array<number>)))}:00 -> ${formatDay(Math.floor(getAverage(data.weeklyEndAvg as Array<number>)))}:00`}</Typography>
                                </Box>
                            </Box>
                            <Tooltip title={t('statsCheckbiz.avgStartEndHelp')}><HelpOutline sx={{ cursor: 'help', position: 'absolute', top: 5, right: 5 }} /></Tooltip>
                        </BorderBox>}

                        {cardIndicatorSelected.includes('avgCostHour') && <BorderBox sx={{ padding: 2, position: 'relative' }}>
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
                                <PendingActionsOutlined style={{ fontSize: 40 }} />
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Typography sx={{ fontSize: 20 }}>{t('statsCheckbiz.avgCostHour')}</Typography>
                                    <Typography sx={{ fontSize: 22 }}>{`${(Math.floor(data.avgCostHour ?? 0))} €`}</Typography>
                                </Box>
                            </Box>
                            <Tooltip title={t('statsCheckbiz.avgCostHourHelp')}><HelpOutline sx={{ cursor: 'help', position: 'absolute', top: 5, right: 5 }} /></Tooltip>

                        </BorderBox>}

                        {cardIndicatorSelected.includes('avgCycleCost') && <BorderBox sx={{ padding: 2, position: 'relative' }}>
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
                                <CurrencyExchangeOutlined style={{ fontSize: 40 }} />
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Typography sx={{ fontSize: 20 }}>{t('statsCheckbiz.avgCycleCost')}</Typography>
                                    <Typography sx={{ fontSize: 22 }}>{`${(Math.floor(data.avgCycleCost ?? 0))} €`}</Typography>
                                </Box>
                            </Box>
                            <Tooltip title={t('statsCheckbiz.avgCycleCostHelp')}><HelpOutline sx={{ cursor: 'help', position: 'absolute', top: 5, right: 5 }} /></Tooltip>
                        </BorderBox>}
                        {cardIndicatorSelected.includes('avgEffectiveCost') && <BorderBox sx={{ padding: 2, position: 'relative' }}>
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
                                <CurrencyExchangeOutlined style={{ fontSize: 40 }} />
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Typography sx={{ fontSize: 20 }}>{t('statsCheckbiz.avgEffectiveCost')}</Typography>
                                    <Typography sx={{ fontSize: 22 }}>{`${(Math.floor(data.avgEffectiveCost ?? 0))} €`}</Typography>
                                </Box>
                            </Box>
                            <Tooltip title={t('statsCheckbiz.avgEffectiveCostHelp')}><HelpOutline sx={{ cursor: 'help', position: 'absolute', top: 5, right: 5 }} /></Tooltip>
                        </BorderBox>}
                    </Box>

                    <Box display={'flex'} flexDirection={'column'} gap={2}>
                        {cardIndicatorSelected.includes('avgCostEfficiency') && <BorderBox sx={{ padding: 2, position: 'relative' }}>
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
                                <CurrencyExchangeOutlined style={{ fontSize: 40 }} />
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Typography sx={{ fontSize: 20 }}>{t('statsCheckbiz.avgCostEfficiency')}</Typography>
                                    <Typography sx={{ fontSize: 22 }}>{`${(Math.floor(data.avgCostEfficiency ?? 0))} €`}</Typography>
                                </Box>
                            </Box>
                            <Tooltip title={t('statsCheckbiz.avgCostEfficiencyHelp')}><HelpOutline sx={{ cursor: 'help', position: 'absolute', top: 5, right: 5 }} /></Tooltip>
                        </BorderBox>}

                        {cardIndicatorSelected.includes('avgWeekWork') && <BorderBox sx={{ padding: 2, position: 'relative' }}>
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Typography sx={{ fontSize: 20 }}>{t('statsCheckbiz.avgWeekWork')}</Typography>
                                    <Typography fontWeight={'bold'} sx={{ fontSize: 25 }}>{`${getAverage(data.weeklyWorkAvg as Array<number>).toFixed(1)} h`}</Typography>
                                </Box>
                            </Box>
                            <Tooltip title={t('statsCheckbiz.avgWeekWorkHelp')}><HelpOutline sx={{ cursor: 'help', position: 'absolute', top: 5, right: 5 }} /></Tooltip>
                        </BorderBox>}

                        {cardIndicatorSelected.includes('rentability') && <BorderBox sx={{ padding: 2, position: 'relative' }}>
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Typography sx={{ fontSize: 20 }}>{t('statsCheckbiz.rentability')}</Typography>
                                    <Typography fontWeight={'bold'} sx={{ fontSize: 25 }}><Snowing />{`${((data.rentability ?? 0)?.toFixed(2))}`}</Typography>
                                </Box>
                            </Box>
                            <Tooltip title={t('statsCheckbiz.rentabilityHelp')}><HelpOutline sx={{ cursor: 'help', position: 'absolute', top: 5, right: 5 }} /></Tooltip>

                        </BorderBox>}


                        {cardIndicatorSelected.includes('dataPoints') && <BorderBox sx={{ padding: 2, position: 'relative' }}>
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Typography sx={{ fontSize: 20 }}>{t('statsCheckbiz.dataPoints')}</Typography>
                                    <Typography fontWeight={'bold'} sx={{ fontSize: 25 }}><Preview /> {`${((data.dataPoints ?? 0)?.toFixed(0))}`}</Typography>
                                </Box>
                            </Box>
                            <Tooltip title={t('statsCheckbiz.dataPointsHelp')}><HelpOutline sx={{ cursor: 'help', position: 'absolute', top: 5, right: 5 }} /></Tooltip>

                        </BorderBox>}

                    </Box>
                </Box>
            </Box>
        </Box>
    );
}


