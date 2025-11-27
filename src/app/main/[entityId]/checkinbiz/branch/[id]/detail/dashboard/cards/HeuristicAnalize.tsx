'use client';
import { Box, Card, CardContent, Divider, IconButton, Typography, useTheme } from '@mui/material';

import { useAppLocale } from '@/hooks/useAppLocale';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { useDashboardBranch } from '../DashboardBranchContext';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useCommonModal } from '@/hooks/useCommonModal';
import { InfoOutline } from '@mui/icons-material';
import InfoModal from '@/components/common/modals/InfoModal';
import { InfoHelp } from '../../../../../../../../../components/common/help/InfoHelp';
import { karla } from '@/config/fonts/google_fonts';
import { useTranslations } from 'next-intl';

export const HeuristicAnalize = () => {
    const { heuristic, cardHeuristicsIndicatorSelected, heuristicsItems } = useDashboardBranch()
    const theme = useTheme()
    const t = useTranslations()


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
                        {t('employeeDashboard.heuristicTitle')}
                    </Typography>
                    <IconButton onClick={() => openModal(CommonModalType.INFO, { id: 'data3' })}><InfoOutline sx={{ fontSize: 25 }} /></IconButton>
                </Box>
                <Typography variant="body1">
                    {t('employeeDashboard.heuristicText1')}
                    {t('employeeDashboard.heuristicText2')}
                </Typography>
            </Box>

            <Divider orientation="horizontal" flexItem />
            <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'space-between'} gap={2} p={3}>
                {heuristic.filter(e => cardHeuristicsIndicatorSelected.includes(e.id)).map((e, i) => <Card key={i} sx={{ width: 450, border: `1px solid ${getColor(e.status as "error" | 'success' | 'warning')}` }}>

                    <CardContent sx={{ background: getColor(e.status as "error" | 'success' | 'warning'), color: "#FFF" }}
                    >





                        <Box display={'flex'} flexDirection={'column'} gap={1}>
                            <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                                <Typography color='#FFF' fontWeight={400} fontSize={24}>
                                    {getTitle(e.status as "error" | 'success' | 'warning')}
                                </Typography>
                            </Box>
                            <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                                <Typography fontFamily={karla.style.fontFamily} color='#1C1B1D' fontWeight={400} fontSize={22}>
                                    {e.name[currentLocale as 'es' | 'en']}
                                </Typography>
                            </Box>
                            <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                                <Typography fontWeight={500} color='#FFF' fontSize={16}>
                                    {e.consequence}
                                </Typography>
                            </Box>
                            <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }} fontSize={12}>
                                    {t('employeeDashboard.recomedation')}
                                </Typography>
                                <Typography fontSize={16} fontWeight={500} color='#1C1B1D'>
                                    {e.action}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>




                </Card>)}
            </Box>

            {open.type === CommonModalType.INFO && open.args?.id === 'data3' && <InfoModal
                centerBtn cancelBtn={false} closeBtn={false} closeIcon={false}
                htmlDescription={<InfoHelp title={t("employeeDashboard.help")}  data={heuristicsItems.map(e => ({
                    head: e.name, items: e.children.map(ch => ({ title: ch.name, description: ch.description as string }))
                }))} />}
                onClose={() => closeModal(CommonModalType.INFO)}
            />}
        </BorderBox>

    );
}


