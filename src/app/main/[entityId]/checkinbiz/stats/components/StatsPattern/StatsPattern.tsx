'use client';
import { Box, Divider, Tooltip, Typography } from '@mui/material';

import { BorderBox } from '@/components/common/tabs/BorderBox';
import { IBranchPattern } from '@/domain/features/checkinbiz/IStats';
import { AccessTimeOutlined, CalendarMonth, CallMissedOutgoingOutlined, FunctionsOutlined, GrainOutlined, Grid4x4Outlined, HelpOutline, PendingActionsOutlined, RefreshOutlined } from '@mui/icons-material';
import { decimalAHorasMinutos } from '@/lib/common/Date';
import { useTranslations } from 'next-intl';
import { getAverage } from '@/lib/common/String';
import { useCheckBizStats } from '../../context/checkBizStatsContext';

export const StatsPatternCards = ({ data, lineal = false }: { data: IBranchPattern, lineal?: boolean }) => {
    const t = useTranslations()
    const { cardIndicatorSelected } = useCheckBizStats()

    const indicatorList = [{
        id: 'avgStartEnd',
        label: t('statsCheckbiz.avgStartEnd'),
        data: `${decimalAHorasMinutos(data.avgStartHour).formatoCorto} -> ${decimalAHorasMinutos(data.avgEndHour).formatoCorto}`,
        help: t('statsCheckbiz.avgStartEndHelp'),
        icon: <AccessTimeOutlined style={{ fontSize: 30 }} />
    },
    {
        id: 'avgCostHour',
        label: t('statsCheckbiz.avgCostHour'),
        data: `${(data.avgCostHour ?? 0).toFixed(2)} €`,
        help: t('statsCheckbiz.avgCostHourHelp'),
        icon: <PendingActionsOutlined style={{ fontSize: 30 }} />
    },
    {
        id: 'avgCycleCost',
        label: t('statsCheckbiz.avgCycleCost'),
        data: `${(Math.floor(data.avgCycleCost ?? 0))} €`,
        help: t('statsCheckbiz.avgCycleCostHelp'),
        icon: <RefreshOutlined style={{ fontSize: 30 }} />
    },
    {
        id: 'avgEffectiveCost',
        label: t('statsCheckbiz.avgEffectiveCost'),
        data: `${(data.avgEffectiveCost ?? 0).toFixed(2)} €`,
        help: t('statsCheckbiz.avgEffectiveCostHelp'),
        icon: <AccessTimeOutlined style={{ fontSize: 30 }} />
    },
    {
        id: 'avgCostEfficiency',
        label: t('statsCheckbiz.avgCostEfficiency'),
        data: `${(data.avgCostEfficiency ?? 0).toFixed(2)} €`,
        help: t('statsCheckbiz.avgCostEfficiencyHelp'),
        icon: <CallMissedOutgoingOutlined style={{ fontSize: 30 }} />
    },

    {
        id: 'avgWeekWork',
        label: t('statsCheckbiz.avgWeekWork'),
        data: `${getAverage(data.weeklyWorkAvg as Array<number>).toFixed(1)} h`,
        help: t('statsCheckbiz.avgWeekWorkHelp'),
        icon: <CalendarMonth style={{ fontSize: 30 }} />
    },

    {
        id: 'reliability',
        label: t('statsCheckbiz.reliability'),
        data: `${((data.reliability ?? 0)?.toFixed(2))}`,
        help: t('statsCheckbiz.reliabilityHelp'),
        icon: <GrainOutlined style={{ fontSize: 30 }} />

    },

    {
        id: 'dataPoints',
        label: t('statsCheckbiz.dataPoints'),
        data: `${((data.dataPoints ?? 0)?.toFixed(0))}`,
        help: t('statsCheckbiz.dataPointsHelp'),
        icon: <Grid4x4Outlined style={{ fontSize: 30 }} />

    },

    {
        id: 'totalCost',
        label: t('statsCheckbiz.totalCost'),
        data: `${((data.totalCost ?? 0)?.toFixed(2))}`,
        help: t('statsCheckbiz.totalCostHelp'),
        icon: <FunctionsOutlined style={{ fontSize: 30 }} />

    },
    ]

    return (
        <Box display={'flex'} flexDirection={'column'} gap={2} sx={{ width: '100%' }}>
            <Typography fontSize={22} fontWeight={'bold'} variant='body2' color='textSecondary'>{data.branch?.name}</Typography>
            <Divider />
            <Box display={'flex'} flexDirection={'row'} gap={2} sx={{ width: '100%' }}>
                <Box display={'flex'} flexDirection={lineal ? 'column' : 'row'} gap={2} sx={{ width: '100%' }}>
                    <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} gap={2}>
                        {indicatorList.map((e, i) => {
                            if (cardIndicatorSelected.includes(e.id))
                                return <BorderBox key={i} sx={{ padding: 2, position: 'relative', width: 200 }}>
                                    <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={2}>
                                        <Box display={'flex'} flexDirection={'column'} >
                                            <Typography sx={{ fontSize: 20 }}>{e.label}</Typography>
                                            <Box display={'flex'} gap={1}  >
                                                {e.icon}
                                                <Typography sx={{ fontSize: 22 }}>{e.data}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Tooltip title={e.help}><HelpOutline sx={{ cursor: 'help', position: 'absolute', top: 5, right: 5 }} /></Tooltip>
                                </BorderBox>
                            else return null
                        })}




                    </Box>


                </Box>
            </Box>
        </Box>
    );
}


