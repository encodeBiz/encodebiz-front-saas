'use client'
import React, { createContext, useContext, useState } from 'react';

import { ISucursal } from '@/domain/features/checkinbiz/ISucursal';
import { fetchSucursal, search } from '@/services/checkinbiz/sucursal.service';
import { useEntity } from '@/hooks/useEntity';
import { ColorBar, colorBarDataset, IBranchPattern, NormalizedIndicators } from '@/domain/features/checkinbiz/IStats';
import { fetchBranchPattern } from '@/services/checkinbiz/stats.service';
import { normalizeBranchDataset } from '@/lib/common/normalizer';



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

interface IDashboardProps {
    branchList: Array<ISucursal>
    branchSelected: Array<ISucursal>,
    setBranchSelected: (items: Array<ISucursal>) => void
    branchPatternList: Array<{
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern,
        normalized: NormalizedIndicators,
        color: ColorBar
    }>,
    pending?: boolean
    preferenceItems: Array<{ name: string, children: Array<{ name: string, value: string }> }>

    cardIndicatorSelected: Array<string>
    setCardIndicatorSelected: (data: Array<string>) => void
    normalizedData: Array<{
        branchId: string,
        branch: ISucursal | null,
        normalized: NormalizedIndicators,
        pattern: IBranchPattern,
        color: ColorBar
    }>
    type: string
    setType: (type: string) => void

    onSelectedBranch: (items: Array<ISucursal>) => void
    initialize: () => void
}

export const DashboardContext = createContext<IDashboardProps | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
    const [branchList, setBranchList] = useState<Array<ISucursal>>([])
    const [branchSelected, setBranchSelected] = useState<ISucursal[]>([]);
    const [branchPatternList, setbranchPatternList] = useState<Array<{
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern,
        normalized: NormalizedIndicators,
        color: ColorBar
    }>>([])
    const [cardIndicatorSelected, setCardIndicatorSelected] = useState<Array<string>>(['avgStartHour_avgEndHour', 'stdStartHour_stdEndHour']);
    const [type, setType] = useState('weeklyWorkAvg')
    const [pending, setPending] = useState(true)
    const [normalizedData, setNormalizedData] = useState<Array<{
        branchId: string,
        branch: ISucursal | null,
        pattern: IBranchPattern,
        normalized: NormalizedIndicators,
        color: ColorBar
    }>>([])
    const { currentEntity } = useEntity()




    const initialize = async () => {
        setPending(true)
        const branchList = await search(currentEntity?.entity?.id as string, { ...{} as any, limit: 100 })
        setBranchList(branchList)
        const branchPatternList: Array<IBranchPattern> = []
        await Promise.all(branchList.map(async (branch) => {
            const dataPattern = await fetchBranchPattern(currentEntity?.entity?.id as string, branch.id as string) as IBranchPattern
            if(dataPattern)
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
            color: ColorBar
        }> = []

        await Promise.all(normalizeData.map(async (branch) => {
            branchPatternDataListt.push({
                branchId: branch.branchId,
                pattern: branch.pattern,
                branch: branch.branchId ? await fetchSucursal(currentEntity?.entity?.id as string, branch.branchId) : null,
                normalized: branch.normalized,
                color: colorBarDataset[0]
            })
        }))

         

      

        setNormalizedData(branchPatternDataListt)
        setCardIndicatorSelected(localStorage.getItem('PANEL_CHECKBIZ_CHART') ? JSON.parse(localStorage.getItem('PANEL_CHECKBIZ_CHART') as string) : ['avgStartHour_avgEndHour', 'stdStartHour_stdEndHour'])
        setBranchList(branchPatternDataListt.filter(e => !!e.branch).map(e => e.branch as ISucursal))
        setbranchPatternList(branchPatternDataListt.filter(e => !!e.branch).slice(0, 3))
        setBranchSelected(branchPatternDataListt.filter(e => !!e.branch).map(e => e.branch as ISucursal).slice(0, 3))
        setPending(false)
    }

    const onSelectedBranch = async (branchSelected: Array<ISucursal>) => {
        setbranchPatternList(normalizedData.filter(e => branchSelected.map(b => b.id).includes(e.branchId)).map((e, i) => ({ ...e, color: colorBarDataset[i] })))
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
        <DashboardContext.Provider value={{ onSelectedBranch, initialize, normalizedData, preferenceItems, type, setType, branchPatternList, cardIndicatorSelected, setCardIndicatorSelected, branchList, branchSelected, setBranchSelected, pending }}>
            {children}
        </DashboardContext.Provider>
    );
}


export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboard must be used within an DashboardContext");
    }
    return context;
};