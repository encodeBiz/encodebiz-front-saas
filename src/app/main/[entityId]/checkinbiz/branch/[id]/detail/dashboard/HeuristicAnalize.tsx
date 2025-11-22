'use client';
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';

import { useAppLocale } from '@/hooks/useAppLocale';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { useDashboardBranch } from './DashboardBranchContext';

export const HeuristicAnalize = () => {
    const {heuristic, cardHeuristicsIndicatorSelected} = useDashboardBranch()
    const theme = useTheme()

    const { currentLocale } = useAppLocale()
    const getColor = (status: "error" | 'success' | 'warning') => {
        if (status == 'error') return theme.palette.error.main
        if (status == 'warning') return theme.palette.warning.main
        if (status == 'success') return theme.palette.success.main
        return theme.palette.primary.main
    }
    return (
        <BorderBox sx={{ background: '#FFF' }} >
            <Box sx={{ p: 4 }}>
                <Typography variant="h6">Indicadores Heurísticos</Typography>
                <Typography variant="body1">
                    Indicadores que muestran cómo funciona la sucursal en términos de horarios, costes y calidad del dato.
                    Permiten entender la estabilidad operativa, el uso real de los recursos y la fiabilidad de la información registrada.
                </Typography>
            </Box>

            <Divider orientation="horizontal" flexItem />

            {heuristic.filter(e => e.active).map((e, i) => <Card key={i} sx={{ maxWidth: 245, border: `1px solid ${getColor(e.status as "error" | 'success' | 'warning')}` }}>
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
        </BorderBox>

    );
}


