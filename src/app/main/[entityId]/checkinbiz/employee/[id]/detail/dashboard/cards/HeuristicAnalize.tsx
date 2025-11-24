'use client';
import { Box, Card, CardContent, Divider, IconButton, Typography, useTheme } from '@mui/material';

import { useAppLocale } from '@/hooks/useAppLocale';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { useDashboardEmployee } from '../DashboardEmployeeContext';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useCommonModal } from '@/hooks/useCommonModal';
import { InfoOutline } from '@mui/icons-material';
import InfoModal from '@/components/common/modals/InfoModal';
import { InfoHelp } from '../../../../../../../../../components/common/help/InfoHelp';
 
export const HeuristicAnalize = () => {
    const { heuristic, cardHeuristicsIndicatorSelected, heuristicsItems } = useDashboardEmployee()
    const theme = useTheme()



    const { currentLocale } = useAppLocale()
    const getColor = (status: "error" | 'success' | 'warning') => {
        if (status == 'success') return 'rgba(122, 223, 127, 0.85)'
        if (status == 'warning') return '#F5B650'
        if (status == 'error') return 'rgba(177, 35, 33, 0.75)'
        return theme.palette.primary.main
    }

    const getTitle = (status: "error" | 'success' | 'warning') => {
        if (status == 'success') return "BUENO"
        if (status == 'warning') return "INESTABLE"
        if (status == 'error') return "CRITICO"
        return theme.palette.primary.main
    }
    const { open, openModal, closeModal } = useCommonModal()

    return (
        <BorderBox sx={{ background: '#FFF' }} >
            <Box sx={{ p: 4 }}>
                <Box display={'flex'} gap={0.2} justifyItems={'center'} alignItems={'center'}>
                    <Typography align="center" sx={{ mb: 0, textAlign: 'left', fontSize: 32 }}>
                        Indicadores Heurísticos
                    </Typography>
                    <IconButton onClick={() => openModal(CommonModalType.INFO, { id: 'data3' })}><InfoOutline sx={{ fontSize: 25 }} /></IconButton>
                </Box>
                <Typography variant="body1">
                    Indicadores que muestran cómo funciona la sucursal en términos de horarios, costes y calidad del dato.
                    Permiten entender la estabilidad operativa, el uso real de los recursos y la fiabilidad de la información registrada.
                </Typography>
            </Box>

            <Divider orientation="horizontal" flexItem />
            <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'space-between'} gap={2} p={3}>
                {heuristic.filter(e => cardHeuristicsIndicatorSelected.includes(e.id) ).map((e, i) => <Card key={i} sx={{ width: 450, border: `1px solid ${getColor(e.status as "error" | 'success' | 'warning')}` }}>
                   
                    <CardContent sx={{ background: getColor(e.status as "error" | 'success' | 'warning'), color: "#FFF" }}
                    >
                        <Box display={'flex'} flexDirection={'column'} gap={1}>
                            <Typography variant="body2" fontWeight={'bold'}   fontSize={22}>
                               {getTitle(e.status as "error" | 'success' | 'warning')}
                            </Typography>
                            <Typography variant="body2" fontWeight={'bold'} sx={{ color: 'text.secondary' }} fontSize={18}>
                                {e.name[currentLocale as 'es' | 'en']}
                            </Typography>

                            <Typography variant="body2" fontSize={18}>
                                {e.consequence}
                            </Typography>

                            <Typography variant="caption" sx={{ color: 'text.secondary' }} fontSize={16}>
                                Recomendación
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }} fontSize={18}>
                                {e.action}
                            </Typography>
                        </Box>
                    </CardContent>


                </Card>)}
            </Box>

            {open.type === CommonModalType.INFO && open.args?.id === 'data3' && <InfoModal
                centerBtn cancelBtn={false} closeBtn={false} closeIcon={false}
                htmlDescription={<InfoHelp title="Ayuda" data={heuristicsItems.map(e=>({head:e.name, items:e.children.map(ch=>({title:ch.name, description:ch.description as string}))
                }))} />}
                onClose={() => closeModal(CommonModalType.INFO)}
            />}
        </BorderBox>

    );
}


