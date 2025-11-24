import { IBranchPattern, IEmployeePattern } from "@/domain/features/checkinbiz/IStats";
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal";
import { decimalAHorasMinutos } from "@/lib/common/Date";
import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import { ClockIcon, EmployeeIcon, MoneyIcon, OkIcon } from "../icons/ChartIndicator";

function safeSum(arr: any) {
    if (!Array.isArray(arr)) return 0;
    return arr.reduce((sum, num) => {
        // Convierte a número y evita NaN
        const value = Number(num) || 0;
        return sum + value;
    }, 0);
}

export const CardIndicatorData = ({ icon, label, value }: { icon: ReactNode, label: string, value: any }) => <Box sx={{
    width: 221, minHeight: 67, borderRadius: 2, border: (theme) => '1px solid ' + theme.palette.primary.main
}} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2} p={1} px={2} >
    <Box sx={{
        background: 'rgba(40, 81, 205, 0.1)',
        borderRadius: 2,
        width: 50,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }}>{icon}</Box>
    <Box display={'flex'} flexDirection={'column'} width={'80%'}>
        <Typography color="#48494C0" fontSize={12} fontWeight={400}>{label}</Typography>
        <Typography variant="body1" fontWeight={500} sx={{ fontSize: 16 }}>{value}</Typography>
    </Box>
</Box>



export const indicatorList = (t: any): Array<{
    id: string,
    label: string,
    data: (data: {
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern | IEmployeePattern,
        color: '#165BAA' | '#A155B9' | '#F765A3'
    }) => string,
    help: string,
    icon: ReactNode,
    tag: Array<'employee' | 'branch'>
}> => [{
    tag: ['employee', 'branch'],
    id: 'avgStartHour_avgEndHour',
    label: 'Horario operativo medio',
    data: (data: {
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern | IEmployeePattern,

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
        pattern: IBranchPattern | IEmployeePattern,
        color: '#165BAA' | '#A155B9' | '#F765A3'
    }) => `${decimalAHorasMinutos(safeSum(data.pattern.weeklyWorkAvg)).formato}`,
    help: t('statsCheckbiz.avgCostHourHelp'),
    icon: <ClockIcon />,
    tag: ['branch'],
},

{
    id: 'dispesion',
    label: 'Dispersión horaria',
    data: (data: {
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern | IEmployeePattern,

        color: '#165BAA' | '#A155B9' | '#F765A3'
    }) => `${(data.pattern as IEmployeePattern).stdStartHour}h - ${(data.pattern as IEmployeePattern).stdEndHour}h`,
    help: t('statsCheckbiz.avgCostHourHelp'),
    icon: <ClockIcon />,
    tag: ['employee'],
},

{
    id: 'avgCostHour',
    label: 'Coste por hora trabajada',
    data: (data: {
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern | IEmployeePattern,

        color: '#165BAA' | '#A155B9' | '#F765A3'
    }) => `${(data.pattern.avgCostHour ?? 0)?.toFixed(2)}`,
    help: t('statsCheckbiz.avgCycleCostHelp'),
    icon: <MoneyIcon />,
    tag: ['branch'],
},
{
    id: 'avgCycleCost',
    label: 'Coste por jornada',
    data: (data: {
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern | IEmployeePattern,
        color: '#165BAA' | '#A155B9' | '#F765A3'
    }) => `${(data.pattern.avgCycleCost ?? 0)?.toFixed(2)}`,
    help: t('statsCheckbiz.avgEffectiveCostHelp'),
    icon: <MoneyIcon />,
    tag: ['employee', 'branch'],
},
{
    id: 'avgCostEfficiency',
    label: 'Coste por rendimiento',
    data: (data: {
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern | IEmployeePattern,

        color: '#165BAA' | '#A155B9' | '#F765A3'
    }) => `${(data.pattern.avgCostEfficiency ?? 0).toFixed(2)}`,
    help: t('statsCheckbiz.avgCostEfficiencyHelp'),
    icon: <MoneyIcon />,
    tag: ['employee', 'branch'],
},

{
    id: 'effectiveRealCost',
    label: 'Rendimiento del coste invertido',
    data: (data: {
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern | IEmployeePattern,

        color: '#165BAA' | '#A155B9' | '#F765A3'
    }) => `${(data.pattern.effectiveRealCost ?? 0).toFixed(2)}`,
    help: t('statsCheckbiz.avgWeekWorkHelp'),
    icon: <MoneyIcon />,
    tag: ['employee', 'branch'],
},

{
    id: 'effectiveRealCost',
    label: 'Coste acumulado',
    data: (data: {
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern | IEmployeePattern,

        color: '#165BAA' | '#A155B9' | '#F765A3'
    }) => `${((data.pattern as IEmployeePattern).totalCost ?? 0).toFixed(2)}`,
    help: t('statsCheckbiz.avgWeekWorkHelp'),
    icon: <MoneyIcon />,
    tag: ['employee', 'branch'],
},

{
    id: 'reliability',
    label: 'Nivel de confiabilidad',
    data: (data: {
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern | IEmployeePattern,

        color: '#165BAA' | '#A155B9' | '#F765A3'
    }) => `${((data.pattern?.reliability ?? 0)?.toFixed(2))}`,
    help: t('statsCheckbiz.reliabilityHelp'),
    icon: <OkIcon />,
    tag: ['employee', 'branch'],

},

{
    id: 'dataPoints',
    label: 'Volumen de datos',
    data: (data: {
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern | IEmployeePattern,

        color: '#165BAA' | '#A155B9' | '#F765A3'
    }) => `${((data.pattern?.dataPoints ?? 0)?.toFixed(0))}`,
    help: t('statsCheckbiz.dataPointsHelp'),
    icon: <OkIcon />,
    tag: ['employee', 'branch'],

},

{
    id: 'experiencia',
    label: 'Experiencia total',
    data: (data: {
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern | IEmployeePattern,

        color: '#165BAA' | '#A155B9' | '#F765A3'
    }) => `${((data.pattern as IEmployeePattern).totalExperienceYears ?? 0)?.toFixed(0)} años`,
    help: t('statsCheckbiz.dataPointsHelp'),
    icon: <EmployeeIcon />,
    tag: ['employee'],

},

{
    id: 'Resp. Principal',
    label: 'Resp. Principal',
    data: (data: {
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern | IEmployeePattern,

        color: '#165BAA' | '#A155B9' | '#F765A3'
    }) => (data.pattern as IEmployeePattern).experienceByResponsibility.length > 0 ?
            `${(data.pattern as IEmployeePattern).experienceByResponsibility[0].responsibility} (${((data.pattern as IEmployeePattern).experienceByResponsibility[0].years ?? 0)?.toFixed(0)} años)` : ' - ',
    help: t('statsCheckbiz.dataPointsHelp'),
    icon: <EmployeeIcon />,
    tag: ['employee'],

},


{
    id: 'Ocupación principal',
    label: 'Ocupación principal',
    data: (data: {
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern | IEmployeePattern,

        color: '#165BAA' | '#A155B9' | '#F765A3'
    }) => (data.pattern as IEmployeePattern).experienceByJob.length > 0 ?
            `${(data.pattern as IEmployeePattern).experienceByJob[0].nameJob} (${(((data.pattern as IEmployeePattern).experienceByJob[0].totalHours ?? 0)/(24*260))?.toFixed(0)} años)` : ' - ',
    help: t('statsCheckbiz.dataPointsHelp'),
    icon: <EmployeeIcon />,
    tag: ['employee'],

},


    ]