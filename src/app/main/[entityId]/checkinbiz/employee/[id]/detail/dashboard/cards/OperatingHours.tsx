/* eslint-disable react-hooks/exhaustive-deps */
import { BorderBox } from "@/components/common/tabs/BorderBox";
import { IBranchPattern, NormalizedIndicators } from "@/domain/features/checkinbiz/IStats";
import { decimalAHorasMinutos } from "@/lib/common/Date";
import { Box, Divider, IconButton, Typography } from "@mui/material";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { InfoOutline } from "@mui/icons-material";
import InfoModal from "@/components/common/modals/InfoModal";
import { useDashboardEmployee } from "../DashboardEmployeeContext";
import { InfoHelp } from "../../../../../../../../../components/common/help/InfoHelp";
import { operationData } from "../../../../../../../../../components/common/help/constants";


const ClockIcon = () => <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_4216_5577" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="21" height="21">
        <rect width="21" height="21" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_4216_5577)">
        <path d="M13.0551 14.2194L14.2189 13.0556L11.1433 9.98V6.15625H9.48076V10.645L13.0551 14.2194ZM10.312 18.625C9.16212 18.625 8.08149 18.4068 7.07014 17.9704C6.05878 17.534 5.17904 16.9417 4.43092 16.1936C3.68279 15.4455 3.09053 14.5657 2.65412 13.5544C2.21771 12.543 1.99951 11.4624 1.99951 10.3125C1.99951 9.1626 2.21771 8.08198 2.65412 7.07062C3.09053 6.05927 3.68279 5.17953 4.43092 4.43141C5.17904 3.68328 6.05878 3.09102 7.07014 2.65461C8.08149 2.2182 9.16212 2 10.312 2C11.4619 2 12.5425 2.2182 13.5539 2.65461C14.5652 3.09102 15.445 3.68328 16.1931 4.43141C16.9412 5.17953 17.5335 6.05927 17.9699 7.07062C18.4063 8.08198 18.6245 9.1626 18.6245 10.3125C18.6245 11.4624 18.4063 12.543 17.9699 13.5544C17.5335 14.5657 16.9412 15.4455 16.1931 16.1936C15.445 16.9417 14.5652 17.534 13.5539 17.9704C12.5425 18.4068 11.4619 18.625 10.312 18.625ZM10.312 16.9625C12.1546 16.9625 13.7236 16.3148 15.019 15.0195C16.3143 13.7241 16.962 12.1551 16.962 10.3125C16.962 8.4699 16.3143 6.90091 15.019 5.60555C13.7236 4.31018 12.1546 3.6625 10.312 3.6625C8.46941 3.6625 6.90042 4.31018 5.60506 5.60555C4.30969 6.90091 3.66201 8.4699 3.66201 10.3125C3.66201 12.1551 4.30969 13.7241 5.60506 15.0195C6.90042 16.3148 8.46941 16.9625 10.312 16.9625Z" fill="#476BE7" />
    </g>
</svg>

const MoneyIcon = () => <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_4216_5803" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="21" height="21">
        <rect width="21" height="21" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_4216_5803)">
        <path d="M7.35 18.375C6.02292 18.375 4.90365 17.9193 3.99219 17.0078C3.08073 16.0964 2.625 14.9771 2.625 13.65C2.625 13.0958 2.71979 12.5562 2.90938 12.0312C3.09896 11.5063 3.36875 11.0323 3.71875 10.6094L6.825 6.86875L4.70312 2.625H16.2969L14.175 6.86875L17.2812 10.6094C17.6313 11.0323 17.901 11.5063 18.0906 12.0312C18.2802 12.5562 18.375 13.0958 18.375 13.65C18.375 14.9771 17.9156 16.0964 16.9969 17.0078C16.0781 17.9193 14.9625 18.375 13.65 18.375H7.35ZM10.5 14C10.0188 14 9.60677 13.8286 9.26406 13.4859C8.92135 13.1432 8.75 12.7312 8.75 12.25C8.75 11.7688 8.92135 11.3568 9.26406 11.0141C9.60677 10.6714 10.0188 10.5 10.5 10.5C10.9812 10.5 11.3932 10.6714 11.7359 11.0141C12.0786 11.3568 12.25 11.7688 12.25 12.25C12.25 12.7312 12.0786 13.1432 11.7359 13.4859C11.3932 13.8286 10.9812 14 10.5 14ZM8.42188 6.125H12.5781L13.4531 4.375H7.54688L8.42188 6.125ZM7.35 16.625H13.65C14.4813 16.625 15.1849 16.337 15.7609 15.7609C16.337 15.1849 16.625 14.4813 16.625 13.65C16.625 13.3 16.563 12.9609 16.4391 12.6328C16.3151 12.3047 16.1438 12.0094 15.925 11.7469L12.7094 7.875H8.3125L5.075 11.725C4.85625 11.9875 4.6849 12.2865 4.56094 12.6219C4.43698 12.9573 4.375 13.3 4.375 13.65C4.375 14.4813 4.66302 15.1849 5.23906 15.7609C5.8151 16.337 6.51875 16.625 7.35 16.625Z" fill="#476BE7" />
    </g>
</svg>

const OkIcon = () => <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_4216_5837" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="21" height="21">
        <rect width="21" height="21" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_4216_5837)">
        <path d="M7.525 19.6875L5.8625 16.8875L2.7125 16.1875L3.01875 12.95L0.875 10.5L3.01875 8.05L2.7125 4.8125L5.8625 4.1125L7.525 1.3125L10.5 2.58125L13.475 1.3125L15.1375 4.1125L18.2875 4.8125L17.9813 8.05L20.125 10.5L17.9813 12.95L18.2875 16.1875L15.1375 16.8875L13.475 19.6875L10.5 18.4188L7.525 19.6875ZM8.26875 17.4563L10.5 16.4938L12.775 17.4563L14 15.3563L16.4062 14.7875L16.1875 12.3375L17.8062 10.5L16.1875 8.61875L16.4062 6.16875L14 5.64375L12.7312 3.54375L10.5 4.50625L8.225 3.54375L7 5.64375L4.59375 6.16875L4.8125 8.61875L3.19375 10.5L4.8125 12.3375L4.59375 14.8313L7 15.3563L8.26875 17.4563ZM9.58125 13.6062L14.525 8.6625L13.3 7.39375L9.58125 11.1125L7.7 9.275L6.475 10.5L9.58125 13.6062Z" fill="#476BE7" />
    </g>
</svg>




export const OperatingHours = () => {
    const t = useTranslations()
    const { open, openModal, closeModal } = useCommonModal()

    const indicatorList: Array<{
        id: string,
        label: string,
        data: (data: {
            branchId: string,
            branch: ISucursal | null,
            pattern: IBranchPattern,
            normalized: NormalizedIndicators
            color: '#165BAA' | '#A155B9' | '#F765A3'
        }) => string,
        help: string,
        icon: ReactNode
    }> = [{
        id: 'avgStartHour_avgEndHour',
        label: 'Horario operativo medio',
        data: (data: {
            branchId: string,
            branch: ISucursal | null,
            pattern: IBranchPattern,
            normalized: NormalizedIndicators
            color: '#165BAA' | '#A155B9' | '#F765A3'
        }) => `${decimalAHorasMinutos(data.pattern?.avgStartHour).formatoCorto} -> ${decimalAHorasMinutos(data.pattern?.avgEndHour).formatoCorto}`,
        help: t('statsCheckbiz.avgStartEndHelp'),
        icon: <ClockIcon />
    },
    {
        id: 'stdStartHour_stdEndHour',
        label: 'Carga horaria semanal',
        data: (data: {
            branchId: string,
            branch: ISucursal | null,
            pattern: IBranchPattern,
            normalized: NormalizedIndicators
            color: '#165BAA' | '#A155B9' | '#F765A3'
        }) => `${decimalAHorasMinutos(data.normalized.horarios.stability).formato}`,
        help: t('statsCheckbiz.avgCostHourHelp'),
        icon: <ClockIcon />
    },
    {
        id: 'avgCostHour',
        label: 'Coste por hora trabajada',
        data: (data: {
            branchId: string,
            branch: ISucursal | null,
            pattern: IBranchPattern,
            normalized: NormalizedIndicators
            color: '#165BAA' | '#A155B9' | '#F765A3'
        }) => `${(data.pattern.avgCostHour ?? 0)?.toFixed(2)}`,
        help: t('statsCheckbiz.avgCycleCostHelp'),
        icon: <MoneyIcon />
    },
    {
        id: 'avgCycleCost',
        label: 'Coste por jornada',
        data: (data: {
            branchId: string,
            branch: ISucursal | null,
            pattern: IBranchPattern,
            normalized: NormalizedIndicators
            color: '#165BAA' | '#A155B9' | '#F765A3'
        }) => `${(data.pattern.avgCycleCost ?? 0)?.toFixed(2)}`,
        help: t('statsCheckbiz.avgEffectiveCostHelp'),
        icon: <MoneyIcon />
    },
    {
        id: 'avgCostEfficiency',
        label: 'Coste por rendimiento',
        data: (data: {
            branchId: string,
            branch: ISucursal | null,
            pattern: IBranchPattern,
            normalized: NormalizedIndicators
            color: '#165BAA' | '#A155B9' | '#F765A3'
        }) => `${(data.pattern.avgCostEfficiency ?? 0).toFixed(2)}`,
        help: t('statsCheckbiz.avgCostEfficiencyHelp'),
        icon: <MoneyIcon />
    },

    {
        id: 'effectiveRealCost',
        label: 'Rendimiento del coste invertido',
        data: (data: {
            branchId: string,
            branch: ISucursal | null,
            pattern: IBranchPattern,
            normalized: NormalizedIndicators
            color: '#165BAA' | '#A155B9' | '#F765A3'
        }) => `${(data.pattern.effectiveRealCost ?? 0).toFixed(2)}`,
        help: t('statsCheckbiz.avgWeekWorkHelp'),
        icon: <MoneyIcon />
    },

    {
        id: 'reliability',
        label: 'Nivel de confiabilidad',
        data: (data: {
            branchId: string,
            branch: ISucursal | null,
            pattern: IBranchPattern,
            normalized: NormalizedIndicators
            color: '#165BAA' | '#A155B9' | '#F765A3'
        }) => `${((data.pattern?.reliability ?? 0)?.toFixed(2))}`,
        help: t('statsCheckbiz.reliabilityHelp'),
        icon: <OkIcon />

    },

    {
        id: 'dataPoints',
        label: 'Volumen de datos',
        data: (data: {
            branchId: string,
            branch: ISucursal | null,
            pattern: IBranchPattern,
            normalized: NormalizedIndicators
            color: '#165BAA' | '#A155B9' | '#F765A3'
        }) => `${((data.pattern?.dataPoints ?? 0)?.toFixed(0))}`,
        help: t('statsCheckbiz.dataPointsHelp'),
        icon: <OkIcon />

    },



        ]
    // Colors for the bars
    const { cardIndicatorSelected, branchPatternList } = useDashboardEmployee()









    return <BorderBox sx={{ background: '#FFF' }} >
        <Box sx={{ p: 4 }}>

            <Box display={'flex'} gap={0.2} justifyItems={'center'} alignItems={'center'}>
                <Typography align="center" sx={{ mb: 0, textAlign: 'left', fontSize: 32 }}>
                    Datos Operativos
                </Typography>
                <IconButton onClick={() => openModal(CommonModalType.INFO, { id: 'data1' })}><InfoOutline sx={{ fontSize: 25 }} /></IconButton>
            </Box>
            <Typography variant="body1">
                Datos que muestran cómo trabaja el empleado en términos de horarios, carga de trabajo y coherencia de sus registros.
                Ayudan a entender su estabilidad operativa, el uso real de su tiempo y la fiabilidad de la información registrada en sus jornadas.
            </Typography>
        </Box>

        <Divider orientation="horizontal" flexItem />
        <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'space-between'} gap={2} p={3}>
            {indicatorList.filter(e => cardIndicatorSelected.includes(e.id)).map((e, i) => <Box key={i} sx={{
                width: 221, minHeight: 67, borderRadius: 2, border: (theme) => '1px solid ' + theme.palette.primary.main
            }} display={'flex'} flexDirection={'row'}  alignItems={'center'} gap={2} p={1} px={2} >
                <Box sx={{
                    background: 'rgba(40, 81, 205, 0.1)',
                    borderRadius: 2,
                    width: 50,
                    height: 45,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>{e.icon}</Box>
                <Box display={'flex'} flexDirection={'column'}>
                    <Typography variant="body1">{e.label}</Typography>
                    <Typography variant="body1" fontWeight={'bold'} sx={{ fontSize: 18 }}>{e.data(branchPatternList[0])}</Typography>
                </Box>
            </Box>)}
        </Box>

        {open.type === CommonModalType.INFO && open.args?.id === 'data1' && <InfoModal
            centerBtn cancelBtn={false} closeBtn={false} closeIcon={false}
                htmlDescription={<InfoHelp title="Ayuda" data={operationData(t)} />}
            onClose={() => closeModal(CommonModalType.INFO)}
        />}
    </BorderBox>
}


