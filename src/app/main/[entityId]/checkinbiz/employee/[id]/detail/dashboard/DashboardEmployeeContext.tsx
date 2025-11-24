'use client'
import React, { createContext, useContext, useState } from 'react';

import { ISucursal } from '@/domain/features/checkinbiz/ISucursal';
import { fetchSucursal, search } from '@/services/checkinbiz/sucursal.service';
import { useEntity } from '@/hooks/useEntity';
import { IEmployeePattern, IHeuristicIndicator, IHeuristicInfo, NormalizedIndicators } from '@/domain/features/checkinbiz/IStats';
import { analiziHeuristic, fetchBranchPattern, fetchEmployeePattern, fetchHeuristicsIndicator } from '@/services/checkinbiz/stats.service';
import { normalizeBranchDataset } from '@/lib/common/normalizer';
import { useAuth } from '@/hooks/useAuth';
import { useAppLocale } from '@/hooks/useAppLocale';
import { IEmployee } from '@/domain/features/checkinbiz/IEmployee';
import { fetchEmployee } from '@/services/checkinbiz/employee.service';


const colors: Array<'#165BAA' | '#A155B9' | '#F765A3'> = ['#165BAA', '#A155B9', '#F765A3']
export interface IDataSet {
    branch: ISucursal,
    pattern: IEmployeePattern,
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

interface IDashboardEmployeeProps {

    setBranchSelected: (items: Array<ISucursal>) => void
    branchPatternList: Array<{
        branchId: string,
        branch: ISucursal | null,
        pattern: IEmployeePattern,
        normalized: NormalizedIndicators,
        color: '#165BAA' | '#A155B9' | '#F765A3'
    }>,
    pending?: boolean
    preferenceItems: Array<{ name: string, children: Array<{ name: string, value: string }> }>
    heuristicsItems: Array<{ name: string, children: Array<{ name: string, value: string, description: string }> }>
    cardHeuristicsIndicatorSelected: Array<string>
    cardIndicatorSelected: Array<string>
    setCardIndicatorSelected: (data: Array<string>) => void
    setCardHeuristicsIndicatorSelected: (data: Array<string>) => void
    normalizedData: Array<{
        branchId: string,
        branch: ISucursal | null,
        normalized: NormalizedIndicators,
        pattern: IEmployeePattern,
        color: '#165BAA' | '#A155B9' | '#F765A3'
    }>
    type: string
    setType: (type: string) => void

    onSelectedBranch: (items: Array<ISucursal>) => void
    initialize: () => void
    heuristic: Array<IHeuristicInfo>
    employeeId: string
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
    "CEE",
    "ECR",
    "ERP",
    "OER",
    "OIR",
    "PQS"
]

export const DashboardEmployeeContext = createContext<IDashboardEmployeeProps | undefined>(undefined);

export const DashboardEmployeeProvider = ({ children, employeeId }: { children: React.ReactNode, employeeId: string }) => {
    const [branchList, setBranchList] = useState<Array<ISucursal>>([])
    const [branchSelected, setBranchSelected] = useState<ISucursal[]>([]);
    const [branchPatternList, setbranchPatternList] = useState<Array<{
        branchId: string,
        branch: ISucursal | null,
        pattern: IEmployeePattern,
        normalized: NormalizedIndicators,
        color: '#165BAA' | '#A155B9' | '#F765A3'
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
        pattern: IEmployeePattern,
        normalized: NormalizedIndicators,
        color: '#165BAA' | '#A155B9' | '#F765A3'
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
        setPending(true)
        const branchList = await search(currentEntity?.entity?.id as string, { ...{} as any, limit: 100 })
        const employee: IEmployee = await fetchEmployee(currentEntity?.entity.id as string, employeeId) as IEmployee
        setBranchList(branchList.filter(e => employee.branchId.includes(e.id)))
        const branchPatternList: Array<IEmployeePattern> = await fetchEmployeePattern(currentEntity?.entity?.id as string, employeeId as string) as Array<IEmployeePattern>
        const normalizeData: Array<{
            branchId: string,
            pattern: IEmployeePattern,
            normalized: NormalizedIndicators
        }> = normalizeBranchDataset(branchPatternList)

        buildHeuristicInfo()



        const branchPatternDataListt: Array<{
            branchId: string,
            branch: ISucursal | null,
            pattern: IEmployeePattern,
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
        const KEY = 'PANEL_EMPLOYEE_CHECKBIZ_CHART_' + employeeId

        setCardIndicatorSelected(localStorage.getItem(KEY) ? JSON.parse(localStorage.getItem(KEY) as string)?.preferenceSelected ?? [...defaultItems1] : [...defaultItems1])
        setCardHeuristicsIndicatorSelected(localStorage.getItem(KEY) ? JSON.parse(localStorage.getItem(KEY) as string)?.preferenceHeuristicSelected ?? [...defaultItems2] : [...defaultItems2])

        setBranchList(branchPatternDataListt.filter(e => !!e.branch).map(e => e.branch as ISucursal))
        setbranchPatternList(branchPatternDataListt.filter(e => !!e.branch).slice(0, 3))
        setBranchSelected(branchPatternDataListt.filter(e => !!e.branch).map(e => e.branch as ISucursal).slice(0, 3))
        //const data: Array<IHeuristicInfo> = await analiziHeuristic(currentEntity?.entity?.id as string, branchId, token, currentLocale)
        //setHeuristic(data.map((e) => ({ ...e, active: true })));
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



    return (
        <DashboardEmployeeContext.Provider value={{ heuristicData, employeeId, heuristic, cardHeuristicsIndicatorSelected, setCardHeuristicsIndicatorSelected, heuristicsItems, onSelectedBranch, initialize, normalizedData, preferenceItems, type, setType, branchPatternList, cardIndicatorSelected, setCardIndicatorSelected,    setBranchSelected, pending }}>
            {children}
        </DashboardEmployeeContext.Provider>
    );
}


export const useDashboardEmployee = () => {
    const context = useContext(DashboardEmployeeContext);
    if (!context) {
        throw new Error("useDashboardEmployee must be used within an DashboardEmployeeContext");
    }
    return context;
};