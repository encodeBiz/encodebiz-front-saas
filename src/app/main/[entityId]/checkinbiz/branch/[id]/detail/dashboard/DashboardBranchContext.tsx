'use client'
import React, { createContext, useContext, useState } from 'react';

import { ISucursal } from '@/domain/features/checkinbiz/ISucursal';
import { fetchSucursal, search } from '@/services/checkinbiz/sucursal.service';
import { useEntity } from '@/hooks/useEntity';
import { ColorBar, colorBarDataset, IBranchPattern, IHeuristicIndicator, IHeuristicInfo } from '@/domain/features/checkinbiz/IStats';
import { fetchHeuristic, fetchBranchPattern, fetchHeuristicsIndicator } from '@/services/checkinbiz/stats.service';
import { useAuth } from '@/hooks/useAuth';
import { useAppLocale } from '@/hooks/useAppLocale';


export interface IDataSet {
    branch: ISucursal,
    pattern: IBranchPattern,
    color: ColorBar
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
        color: ColorBar
    }>,
    pending?: boolean
    heuristicsItems: Array<{ name: string, children: Array<{ name: string, value: string, description: string }> }>
    cardHeuristicsIndicatorSelected: Array<string>
    cardIndicatorSelected: Array<string>
    setCardIndicatorSelected: (data: Array<string>) => void
    setCardHeuristicsIndicatorSelected: (data: Array<string>) => void
    normalizedData: Array<{
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern,
        color: ColorBar
    }>
    type: string
    setType: (type: string) => void

    onSelectedBranch: (items: Array<ISucursal>) => void
    initialize: () => void
    heuristic: Array<IHeuristicInfo>
    branchId: string
    heuristicData: Array<IHeuristicIndicator>


}

const defaultItems1 = [
    "avgStartHour_avgEndHour",
    "stdStartHour_stdEndHour",
    "avgCostHour",
    "avgCycleCost",
    "avgCostEfficiency",
    "effectiveRealCost",
    "reliability",
    "dataPoints"
]

const defaultItems2 = [
    "CEE",  // Evolución Eficiencia/Coste
    "CPD",  // Delta de Rendimiento de Costos
    "CRI",  // Índice de Riesgo de Coste
    "ECR",  // Relación Eficiencia/Costo
    "ERP",  // Potencial de Recuperación de Eficiencia
    "OER"   // Ratio de Eficiencia Operativa
]

export const DashboardBranchContext = createContext<IDashboardBranchProps | undefined>(undefined);

export const DashboardBranchProvider = ({ children, branchId }: { children: React.ReactNode, branchId: string }) => {
    const [branchList, setBranchList] = useState<Array<ISucursal>>([])
    const [branchSelected, setBranchSelected] = useState<ISucursal[]>([]);
    const [branchPatternList, setbranchPatternList] = useState<Array<{
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern,
        color: ColorBar
    }>>([])
    const [cardIndicatorSelected, setCardIndicatorSelected] = useState<Array<string>>(['avgStartHour_avgEndHour', 'stdStartHour_stdEndHour']);
    const [cardHeuristicsIndicatorSelected, setCardHeuristicsIndicatorSelected] = useState<Array<string>>([]);
    const [heuristicsItems, setHeuristicsItems] = useState<Array<{ name: string, children: Array<{ name: string, value: string, description: string }> }>>([])
    const [heuristic, setHeuristic] = useState<Array<IHeuristicInfo>>([])
    const [heuristicData, setHeuristicData] = useState<Array<IHeuristicIndicator>>([])

    const { token } = useAuth()
    const { currentLocale } = useAppLocale()
    const [type, setType] = useState('weeklyWorkAvg')
    const [pending, setPending] = useState(true)
    const [normalizedData, setNormalizedData] = useState<Array<{
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern,
        color: ColorBar
    }>>([])
    const { currentEntity } = useEntity()

    const getHead = (heuristicsIndicator: Array<IHeuristicIndicator>, key: string) => {
        return (heuristicsIndicator.find(e => e.group.id === key)?.group.label as any)[currentLocale as any]
    }
    const getIndicator = (heuristicsIndicator: Array<IHeuristicIndicator>, key: string) => {
        return (heuristicsIndicator.find(e => e.id === key)?.name as any)[currentLocale as any]
    }
    const getIndicatorDesc = (heuristicsIndicator: Array<IHeuristicIndicator>, key: string) => {
        return (heuristicsIndicator.find(e => e.id === key)?.description as any)[currentLocale as any]
    }

    const buildHeuristicInfo = async () => {
        const heuristicsIndicator = await fetchHeuristicsIndicator()
        setHeuristicData(heuristicsIndicator)

        const heuristicsItems: Array<{ name: string, children: Array<{ name: string, description: string, value: string }> }> = []
        heuristicsIndicator.forEach(element => {
            if (!heuristicsItems.find(e => e.name === element.group.id))
                heuristicsItems.push({
                    name: element.group.id,
                    children: []
                })

            if (heuristicsItems.find(e => e.name === element.group.id)) {
                const index = heuristicsItems.findIndex(e => e.name === element.group.id)
                heuristicsItems[index].children.push({
                    name: element.id,
                    value: element.id,
                    description: element.id,
                })
            }
        });
        setHeuristicsItems(heuristicsItems.map(e => ({ ...e, children: e.children.map(ch => ({ ...ch, name: getIndicator(heuristicsIndicator, ch.name), description: getIndicatorDesc(heuristicsIndicator, ch.description) })), name: getHead(heuristicsIndicator, e.name) })));
    }
    const initialize = async () => {
        try {


            setPending(true)
            const branchList = await search(currentEntity?.entity?.id as string, { ...{} as any, limit: 100 })
            setBranchList(branchList.filter(e => e.id === branchId))
            const branchPatternList: Array<IBranchPattern> = []
            await Promise.all(branchList.filter(e => e.id === branchId).map(async (branch) => {
                const dataPattern = await fetchBranchPattern(currentEntity?.entity?.id as string, branch.id as string) as IBranchPattern
                branchPatternList.push(dataPattern as IBranchPattern)
            }))

            buildHeuristicInfo()

            const branchPatternDataListt: Array<{
                branchId: string,
                branch: ISucursal | null,
                pattern: IBranchPattern,
                color: ColorBar
            }> = []
            await Promise.all(branchPatternList.map(async (pattern, i) => {
                branchPatternDataListt.push({
                    branchId: pattern.branchId,
                    pattern: pattern,
                    branch: pattern.branchId ? await fetchSucursal(currentEntity?.entity?.id as string, pattern.branchId) : null,
                    color: colorBarDataset[i]
                })
            }))
            setNormalizedData(branchPatternDataListt)
            const KEY = 'PANEL_BRANCH_CHECKBIZ_CHART_' + branchId
            setCardIndicatorSelected(localStorage.getItem(KEY) ? JSON.parse(localStorage.getItem(KEY) as string)?.preferenceSelected ?? [...defaultItems1] : [...defaultItems1])
            setCardHeuristicsIndicatorSelected(localStorage.getItem(KEY) ? JSON.parse(localStorage.getItem(KEY) as string)?.preferenceHeuristicSelected ?? [...defaultItems2] : [...defaultItems2])

            const KEY_TYPE = 'PANEL_BRANCH_CHECKBIZ_CHART_TIME_' + branchId
            setType(localStorage.getItem(KEY_TYPE) ? localStorage.getItem(KEY_TYPE) as string : 'weeklyWorkAvg')


            setBranchList(branchPatternDataListt.filter(e => !!e.branch).map(e => e.branch as ISucursal))
            setbranchPatternList(branchPatternDataListt.filter(e => !!e.branch).slice(0, 3))
            setBranchSelected(branchPatternDataListt.filter(e => !!e.branch).map(e => e.branch as ISucursal).slice(0, 3))
            const data: Array<IHeuristicInfo> = await fetchHeuristic(currentEntity?.entity?.id as string, branchId, null, token, currentLocale)
            setHeuristic(data.map((e) => ({ ...e, active: true })));
            setPending(false)


        } catch {
            setPending(false)
        }
    }

    const onSelectedBranch = async (branchSelected: Array<ISucursal>) => {
        setbranchPatternList(normalizedData.filter(e => branchSelected.map(b => b.id).includes(e.branchId)))
    }




    return (
        <DashboardBranchContext.Provider value={{ heuristicData, branchId, heuristic, cardHeuristicsIndicatorSelected, setCardHeuristicsIndicatorSelected, heuristicsItems, onSelectedBranch, initialize, normalizedData, type, setType, branchPatternList, cardIndicatorSelected, setCardIndicatorSelected, branchList, branchSelected, setBranchSelected, pending }}>
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
