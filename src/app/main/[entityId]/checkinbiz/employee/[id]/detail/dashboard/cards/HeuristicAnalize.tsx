'use client';
import { Box, Card, CardContent, Divider, IconButton, Typography, } from '@mui/material';

import { useAppLocale } from '@/hooks/useAppLocale';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { useDashboardEmployee } from '../DashboardEmployeeContext';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useCommonModal } from '@/hooks/useCommonModal';
import { InfoOutline } from '@mui/icons-material';
import InfoModal from '@/components/common/modals/InfoModal';
import { InfoHelp } from '../../../../../../../../../components/common/help/InfoHelp';
  
export const HeuristicAnalize = () => {
    const { heuristic, heuristicsItems } = useDashboardEmployee()
 


    const { currentLocale } = useAppLocale()


    const { open, openModal, closeModal } = useCommonModal()

    if(heuristic.length===0) return null
    else
    return (
        <BorderBox sx={{ background: '#FFF' }} >
            <Box sx={{ p: 4 }}>
                <Box display={'flex'} gap={0.2} justifyItems={'center'} alignItems={'center'}>
                    <Typography align="center" sx={{ mb: 0, textAlign: 'left', fontSize: 32 }}>
                        Evaluación Operativa del Empleado
                    </Typography>
                    <IconButton onClick={() => openModal(CommonModalType.INFO, { id: 'data3' })}><InfoOutline sx={{ fontSize: 25 }} /></IconButton>
                </Box>
                <Typography variant="body1">
                    Diagnóstico automático que interpreta el comportamiento real del trabajador y genera conclusiones claras sobre su desempeño, estabilidad y potencial dentro del equipo. Permite identificar talento, riesgos operativos y oportunidades de mejora basadas en datos objetivos.
                </Typography>
            </Box>

            <Divider orientation="horizontal" flexItem />
            <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'space-between'} gap={2} p={3}>

               
                {heuristic.map((e, i) => <Card key={i} sx={{ width: 450, bgcolor: `#B1C5FF` }}>

                    <CardContent sx={{ background: `#B1C5FF`, color: "#FFF" }}
                    >
                        <Box display={'flex'} flexDirection={'column'} gap={1}>
                            <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                                <Typography color='#1C1B1D' fontWeight={500} fontSize={16}>
                                    {e.name[currentLocale as 'es' | 'en']}
                                </Typography>
                            </Box>
                            <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                                <Typography fontWeight={500} color='#FFF' fontSize={16}>
                                    {e.consequence}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>


                </Card>)}
            </Box>

            {open.type === CommonModalType.INFO && open.args?.id === 'data3' && <InfoModal
                centerBtn cancelBtn={false} closeBtn={false} closeIcon={false}
                htmlDescription={<InfoHelp title="Ayuda" data={heuristicsItems.map(e => ({
                    head: e.name, items: e.children.map(ch => ({ title: ch.name, description: ch.description as string }))
                }))} />}
                onClose={() => closeModal(CommonModalType.INFO)}
            />}
        </BorderBox>

    );
}


