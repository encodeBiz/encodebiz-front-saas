'use client'
import React, { createContext, useContext, useState } from 'react';

import { ISucursal } from '@/domain/features/checkinbiz/ISucursal';
import { fetchSucursal, search } from '@/services/checkinbiz/sucursal.service';
import { useEntity } from '@/hooks/useEntity';
import { IBranchPattern, IHeuristicInfo, NormalizedIndicators } from '@/domain/features/checkinbiz/IStats';
import { analiziHeuristic, fetchBranchPattern } from '@/services/checkinbiz/stats.service';
import { normalizeBranchDataset } from '@/lib/common/normalizer';
import { useAuth } from '@/hooks/useAuth';
import { useAppLocale } from '@/hooks/useAppLocale';


const colors: Array<'#165BAA' | '#A155B9' | '#F765A3'> = ['#165BAA', '#A155B9', '#F765A3']
export interface IDataSet {
    branch: ISucursal,
    pattern: IBranchPattern,
    color: '#165BAA' | '#A155B9' | '#F765A3'
}

export const getTextByKey = (key: string, preferenceItems: Array<{ name: string, children: Array<{ name: string, value: string }> }>) => {
    let text = key
    preferenceItems.forEach(element => {
        element.children.forEach(child => {
            if (child.value === key) text = child.name
        });
    });
    return text
}

interface IDashboardBranchProps {
    branchList: Array<ISucursal>
    branchSelected: Array<ISucursal>,
    setBranchSelected: (items: Array<ISucursal>) => void
    branchPatternList: Array<{
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern,
        normalized: NormalizedIndicators,
        color: '#165BAA' | '#A155B9' | '#F765A3'
    }>,
    pending?: boolean
    preferenceItems: Array<{ name: string, children: Array<{ name: string, value: string }> }>
    heuristicsItems: Array<{ name: string, children: Array<{ name: string, value: string }> }>
    cardHeuristicsIndicatorSelected: Array<string>
    cardIndicatorSelected: Array<string>
    setCardIndicatorSelected: (data: Array<string>) => void
    setCardHeuristicsIndicatorSelected: (data: Array<string>) => void
    normalizedData: Array<{
        branchId: string,
        branch: ISucursal | null,
        normalized: NormalizedIndicators,
        pattern: IBranchPattern,
        color: '#165BAA' | '#A155B9' | '#F765A3'
    }>
    type: string
    setType: (type: string) => void

    onSelectedBranch: (items: Array<ISucursal>) => void
    initialize: () => void
    heuristic: Array<IHeuristicInfo>
}

export const DashboardBranchContext = createContext<IDashboardBranchProps | undefined>(undefined);

export const DashboardBranchProvider = ({ children, branchId }: { children: React.ReactNode, branchId: string }) => {
    const [branchList, setBranchList] = useState<Array<ISucursal>>([])
    const [branchSelected, setBranchSelected] = useState<ISucursal[]>([]);
    const [branchPatternList, setbranchPatternList] = useState<Array<{
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern,
        normalized: NormalizedIndicators,
        color: '#165BAA' | '#A155B9' | '#F765A3'
    }>>([])
    const [cardIndicatorSelected, setCardIndicatorSelected] = useState<Array<string>>(['avgStartHour_avgEndHour', 'stdStartHour_stdEndHour']);
    const [cardHeuristicsIndicatorSelected, setCardHeuristicsIndicatorSelected] = useState<Array<string>>([]);
    const [heuristic, setHeuristic] = useState<Array<IHeuristicInfo>>([])
    const { token } = useAuth()
    const { currentLocale } = useAppLocale()
    const [type, setType] = useState('weeklyWorkAvg')
    const [pending, setPending] = useState(true)
    const [normalizedData, setNormalizedData] = useState<Array<{
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern,
        normalized: NormalizedIndicators,
        color: '#165BAA' | '#A155B9' | '#F765A3'
    }>>([])
    const { currentEntity } = useEntity()




    const initialize = async () => {
        setPending(true)
        const branchList = await search(currentEntity?.entity?.id as string, { ...{} as any, limit: 100 })
        setBranchList(branchList.filter(e => e.id === branchId))
        const branchPatternList: Array<IBranchPattern> = []
        await Promise.all(branchList.filter(e => e.id === branchId).map(async (branch) => {
            const dataPattern = await fetchBranchPattern(currentEntity?.entity?.id as string, branch.id as string) as IBranchPattern
            branchPatternList.push(dataPattern as IBranchPattern)
        }))
        const normalizeData: Array<{
            branchId: string,
            pattern: IBranchPattern,
            normalized: NormalizedIndicators
        }> = normalizeBranchDataset(branchPatternList)

        const branchPatternDataListt: Array<{
            branchId: string,
            branch: ISucursal | null,
            pattern: IBranchPattern,
            normalized: NormalizedIndicators
            color: '#165BAA' | '#A155B9' | '#F765A3'
        }> = []
        await Promise.all(normalizeData.map(async (branch) => {
            branchPatternDataListt.push({
                branchId: branch.branchId,
                pattern: branch.pattern,
                branch: branch.branchId ? await fetchSucursal(currentEntity?.entity?.id as string, branch.branchId) : null,
                normalized: branch.normalized,
                color: '#165BAA'
            })
        }))
        setNormalizedData(branchPatternDataListt)
        setCardIndicatorSelected(localStorage.getItem('PANEL_CHECKBIZ_CHART') ? JSON.parse(localStorage.getItem('PANEL_CHECKBIZ_CHART') as string) : ['avgStartHour_avgEndHour', 'stdStartHour_stdEndHour'])
        setBranchList(branchPatternDataListt.filter(e => !!e.branch).map(e => e.branch as ISucursal))
        setbranchPatternList(branchPatternDataListt.filter(e => !!e.branch).slice(0, 3))
        setBranchSelected(branchPatternDataListt.filter(e => !!e.branch).map(e => e.branch as ISucursal).slice(0, 3))
        const data: Array<IHeuristicInfo> = await analiziHeuristic(currentEntity?.entity?.id as string, branchId, token, currentLocale)
        setHeuristic(data.map((e, i) => ({ ...e, active: true})));


        setPending(false)
    }

    const onSelectedBranch = async (branchSelected: Array<ISucursal>) => {
        setbranchPatternList(normalizedData.filter(e => branchSelected.map(b => b.id).includes(e.branchId)).map((e, i) => ({ ...e, color: colors[i] })))
    }





    const preferenceItems: Array<{ name: string, children: Array<{ name: string, value: string }> }> = [
        {
            name: 'Horarios',
            children: [
                { name: 'Horario operativo medio', value: 'avgStartHour_avgEndHour' },
                { name: 'Carga horaria semanal', value: 'stdStartHour_stdEndHour' },
            ]
        },

        {
            name: 'Costes',
            children: [
                { name: 'Coste por hora trabajada', value: 'avgCostHour' },
                { name: 'Coste por jornada', value: 'avgCycleCost' },
                { name: 'Coste por rendimiento', value: 'avgCostEfficiency' },
                { name: 'Rendimiento del coste invertido', value: 'effectiveRealCost' },

            ]
        },
        {
            name: 'Confiabilidad del dato',
            children: [
                { name: 'Nivel de confiabilidad ', value: 'reliability' },
                { name: 'Volumen de datos', value: 'dataPoints' },
            ]
        },

    ];

    const heuristicsItems: Array<{ name: string, children: Array<{ name: string, value: string }> }> = [
        {
            name: 'Indicadores Simples',
            children: [
                { name: 'Equilibrio de horas semanales', value: '' },
                { name: 'Desviación del horario de inicio', value: '' },
                { name: 'Estimación de eficiencia del coste', value: '' },

            ]
        },

        {
            name: 'Indicadores Diferenciales',
            children: [
                { name: 'Desviación del patrón de coste', value: '' },
                { name: 'Variación de estabilidad operativa', value: '' },
                { name: 'Desviación del patrón temporal', value: '' },

            ]
        },
        {
            name: 'Indicadores Combinados',
            children: [
                { name: 'Coste por rendimiento operativo', value: '' },
                { name: 'Rendimiento operativo', value: '' },
                { name: 'Índice de coherencia coste–dato', value: '' },
                { name: 'Consistencia coste–fiabilidad', value: '' },
                { name: 'Índice de estabilidad operativa', value: '' },
                { name: 'Rendimiento efectivo', value: '' },

            ]
        },
        {
            name: 'Indicadores Avanzados',
            children: [
                { name: 'Índice operativo global', value: '' },
                { name: 'Índice de calidad operativa', value: '' },
                { name: 'Fuerza del patrón operativo', value: '' },
                { name: 'Puntuación de calidad del patrón', value: '' },
                { name: 'Puntuación de estabilidad del patrón', value: '' },
                { name: 'Rendimiento efectivo', value: '' },
                { name: 'Rendimiento efectivo avanzado', value: '' },
                { name: 'Fuerza del patrón avanzada', value: '' },
                { name: 'Índice de insight operativo', value: '' },
            ]
        },

    ];


    return (
        <DashboardBranchContext.Provider value={{ heuristic, cardHeuristicsIndicatorSelected, setCardHeuristicsIndicatorSelected, heuristicsItems, onSelectedBranch, initialize, normalizedData, preferenceItems, type, setType, branchPatternList, cardIndicatorSelected, setCardIndicatorSelected, branchList, branchSelected, setBranchSelected, pending }}>
            {children}
        </DashboardBranchContext.Provider>
    );
}


export const useDashboardBranch = () => {
    const context = useContext(DashboardBranchContext);
    if (!context) {
        throw new Error("useDashboardBranch must be used within an DashboardBranchContext");
    }
    return context;
};