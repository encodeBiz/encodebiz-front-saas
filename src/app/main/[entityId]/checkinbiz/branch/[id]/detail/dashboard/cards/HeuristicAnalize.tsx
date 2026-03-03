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
import EmptyList from '@/components/common/EmptyState/EmptyList';
import emptyImage from '../../../../../../../../../../public/assets/images/empty/datos.svg';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { useState } from 'react';

const operationalHelp = (t: any) => ([
    {
        head: t('statsCheckbiz.help.performance.title'),
        items: [
            { title: t('statsCheckbiz.help.performance.items.efficiencyCost.title'), description: t('statsCheckbiz.help.performance.items.efficiencyCost.desc') },
            { title: t('statsCheckbiz.help.performance.items.evolution.title'), description: t('statsCheckbiz.help.performance.items.evolution.desc') },
            { title: t('statsCheckbiz.help.performance.items.recoveryPotential.title'), description: t('statsCheckbiz.help.performance.items.recoveryPotential.desc') },
            { title: t('statsCheckbiz.help.performance.items.operationalEfficiency.title'), description: t('statsCheckbiz.help.performance.items.operationalEfficiency.desc') },
            { title: t('statsCheckbiz.help.performance.items.operationalInefficiency.title'), description: t('statsCheckbiz.help.performance.items.operationalInefficiency.desc') },
            { title: t('statsCheckbiz.help.performance.items.costRisk.title'), description: t('statsCheckbiz.help.performance.items.costRisk.desc') },
            { title: t('statsCheckbiz.help.performance.items.globalHealth.title'), description: t('statsCheckbiz.help.performance.items.globalHealth.desc') },
            { title: t('statsCheckbiz.help.performance.items.confidence.title'), description: t('statsCheckbiz.help.performance.items.confidence.desc') },
            { title: t('statsCheckbiz.help.performance.items.shiftDeviation.title'), description: t('statsCheckbiz.help.performance.items.shiftDeviation.desc') },
            { title: t('statsCheckbiz.help.performance.items.returnPerHour.title'), description: t('statsCheckbiz.help.performance.items.returnPerHour.desc') },
        ]
    }
])

export const HeuristicAnalize = () => {
    const { heuristic, cardHeuristicsIndicatorSelected, pending, heuristicsItems } = useDashboardBranch()
    const theme = useTheme()
    const t = useTranslations()
    const [showMore, setShowMore] = useState(false)


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

    const HeuristicCard = ({ e }: { e: any }) => <Card sx={{
        width: {
            xs: '100%',
            sm: '100%',
            md: '100%',
            lg: '45%',
            xl: '45%'
        }, border: `1px solid ${getColor(e.status as "error" | 'success' | 'warning')}`
    }}>
        <CardContent sx={{ background: getColor(e.status as "error" | 'success' | 'warning'), color: "#FFF" }}>
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
    </Card>

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



            <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'space-between'} gap={2} p={3} pb={2}>
                {heuristic.filter(e => cardHeuristicsIndicatorSelected.includes(e.id)).slice(0, 4).map((e, i) => <HeuristicCard key={i} e={e} />)}
            </Box>

            {showMore && <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'space-between'} gap={2} p={3} pt={0}>
                {heuristic.filter(e => cardHeuristicsIndicatorSelected.includes(e.id)).slice(4, 100).map((e, i) => <HeuristicCard key={i} e={e} />)}
            </Box>}


            {!pending && heuristic.filter(e => cardHeuristicsIndicatorSelected.includes(e.id)).length != 0 && <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'center'} mb={2}>
                <SassButton variant='outlined' onClick={() => setShowMore(!showMore)}>{showMore ? t('core.button.minus') : t('core.button.more')}</SassButton>
            </Box>}

            {!pending && heuristic.length == 0 && <Box sx={{ p: 3, width: '100%' }} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'} gap={5} pt={5}>
                <EmptyList
                    imageUrl={emptyImage}
                    title={t('statsCheckbiz.statsNoDataTitle')}
                    description={t('statsCheckbiz.statsNoDataText')}
                />
            </Box>}

            {open.type === CommonModalType.INFO && open.args?.id === 'data3' && <InfoModal
                centerBtn cancelBtn={false} closeBtn={false} closeIcon={false}
                htmlDescription={<InfoHelp title={t("employeeDashboard.help")} data={operationalHelp(t)} />}
                onClose={() => closeModal(CommonModalType.INFO)}
            />}
        </BorderBox>

    );
}
