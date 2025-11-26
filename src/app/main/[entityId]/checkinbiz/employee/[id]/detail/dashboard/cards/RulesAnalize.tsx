'use client';
import { Box, Card, CardContent, Divider, Typography, } from '@mui/material';

import { useAppLocale } from '@/hooks/useAppLocale';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { useDashboardEmployee } from '../DashboardEmployeeContext';
import { useTranslations } from 'next-intl';


export const RulesAnalize = () => {
    const { heuristic } = useDashboardEmployee()
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


                    {heuristic.map((e, i) => <Card key={i} sx={{ width: 450, bgcolor: `#B1C5FF` }}>

                        <CardContent sx={{ background: `#B1C5FF`, color: "#FFF" }}
                        >
                            <Box display={'flex'} flexDirection={'column'} gap={2}>
                                <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                                    <Typography color='#1C1B1D' fontWeight={500} fontSize={16}>
                                       {t('employeeDashboard.toPromo')}:
                                    </Typography>
                                    <Typography color='#1C1B1D' fontWeight={500} fontSize={16}>
                                        {(e.explanation as any)[currentLocale]}
                                    </Typography>
                                </Box>
                                <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                                    {e.actions.map((a, x) => <Typography key={x} fontWeight={500} color='#FFF' fontSize={16}>
                                        {a.description}
                                    </Typography>)}
                                </Box>
                            </Box>
                        </CardContent>


                    </Card>)}
                </Box>

            </BorderBox>

        );
}


