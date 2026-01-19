'use client';
import { Box, Card, CardContent, Divider, Typography, } from '@mui/material';

import { useAppLocale } from '@/hooks/useAppLocale';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { useDashboardEmployee } from '../DashboardEmployeeContext';
import { useTranslations } from 'next-intl';
import emptyImage from '../../../../../../../../../../public/assets/images/empty/datos.svg';
import EmptyList from '@/components/common/EmptyState/EmptyList';


export const RulesAnalize = () => {
    const { heuristic, pending } = useDashboardEmployee()
    const { currentLocale } = useAppLocale()
    const t = useTranslations()
    if (heuristic.length === 0) return null
    else
        return (
            <BorderBox sx={{ background: '#FFF' }} >
                <Box sx={{ p: 4 }}>
                    <Box display={'flex'} gap={0.2} justifyItems={'center'} alignItems={'center'}>
                        <Typography align="center" sx={{ mb: 0, textAlign: 'left', fontSize: 32 }}>
                            {t('employeeDashboard.ruleTitle')}
                        </Typography>
                    </Box>
                    <Typography variant="body1">
                        {t('employeeDashboard.ruleText')}
                    </Typography>
                </Box>

                <Divider orientation="horizontal" flexItem />
                <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'space-between'} gap={2} p={3}>
                    {!pending && heuristic.length == 0 && <Box sx={{ p: 3, width: '100%' }} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} gap={5} pt={5}>
                        <EmptyList
                            imageUrl={emptyImage}
                            title={t('statsCheckbiz.statsNoDataTitle')}
                            description={t('statsCheckbiz.statsNoDataText')}
                        />
                    </Box>}

                    {heuristic.map((e, i) => <Card key={i} sx={{ width: 450, bgcolor: `#B1C5FF` }}>

                        <CardContent sx={{ background: `#B1C5FF`, color: "#FFF" }}
                        >
                            <Box display={'flex'} flexDirection={'column'} gap={2}>
                                {e.actions.map((a, x) => <Box key={x} display={'flex'} flexDirection={'column'} gap={0.5}>
                                    <Typography color='#1C1B1D' fontWeight={500} fontSize={16}>
                                        {a.label}:
                                    </Typography>
                                    <Typography color='#1C1B1D' fontWeight={500} fontSize={16}>
                                        {a.description}
                                    </Typography>
                                </Box>)}
                                <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                                    <Typography fontWeight={500} color='#FFF' fontSize={16}>
                                        {(e.explanation as any)[currentLocale]}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>


                    </Card>)}
                </Box>

            </BorderBox>

        );
}


