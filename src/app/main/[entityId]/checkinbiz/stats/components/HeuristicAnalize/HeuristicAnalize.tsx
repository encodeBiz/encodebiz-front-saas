'use client';
import { Box, Card, CardContent, CardHeader, Typography, useTheme } from '@mui/material';

import { useTranslations } from 'next-intl';
import { useCheckBizStats } from '../../context/checkBizStatsContext';
import { useAppLocale } from '@/hooks/useAppLocale';

export const HeuristicAnalize = () => {
    const t = useTranslations()
    const theme = useTheme()
    const { heuristicData } = useCheckBizStats()
    const { currentLocale } = useAppLocale()
    const getColor = (status: "error" | 'success' | 'warning') => {
        if (status == 'error') return theme.palette.error.main
        if (status == 'warning') return theme.palette.warning.main
        if (status == 'success') return theme.palette.success.main
        return theme.palette.primary.main
    }
    return (
        <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'space-between'} gap={2} sx={{ width: '100%' }}>

            {heuristicData.filter(e => e.active).map((e, i) => <Card key={i} sx={{ maxWidth: 245, border: `1px solid ${getColor(e.status as "error" | 'success' | 'warning')}` }}>
                <CardHeader
                    sx={{ background: getColor(e.status as "error" | 'success' | 'warning'), color: "#FFF", fontSize: 16 }}
                    action={
                        <Typography variant="body2" fontSize={18}>{e.value.toFixed(2)}</Typography>
                    }
                    title={e.label}
                />
                <CardContent>
                    <Box display={'flex'} flexDirection={'column'} gap={1}>
                        <Typography variant="body2" fontWeight={'bold'} fontSize={18}>
                            {e.id}: {e.name[currentLocale as 'es' | 'en']}
                        </Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }} fontSize={18}>
                            {e.consequence}
                        </Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }} fontSize={18}>
                            {e.action}
                        </Typography>
                    </Box>
                </CardContent>


            </Card>)}

        </Box>
    );
}


