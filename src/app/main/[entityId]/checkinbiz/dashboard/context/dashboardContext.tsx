/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';

import { ISucursal } from '@/domain/features/checkinbiz/ISucursal';
import { search } from '@/services/checkinbiz/sucursal.service';
import { useEntity } from '@/hooks/useEntity';
import { IBranchPattern } from '@/domain/features/checkinbiz/IStats';
import { fetchBranchPattern } from '@/services/checkinbiz/stats.service';


const colors: Array<'#165BAA' | '#A155B9' | '#F765A3'> = ['#165BAA', '#A155B9', '#F765A3']
export interface IDataSet {
    branch: ISucursal,
    pattern: IBranchPattern,
    color: '#165BAA' | '#A155B9' | '#F765A3'
}

interface IDashboardProps {
    branchList: Array<ISucursal>
    branchSelected: Array<ISucursal>,
    setBranchSelected: (items: Array<ISucursal>) => void
    branchPatternList: Array<IDataSet>,
    pending?: boolean
    preferenceItems: Array<{ name: string, children: Array<{ name: string, value: string }> }>

    cardIndicatorSelected: Array<string>
    setCardIndicatorSelected: (data: Array<string>) => void

    type: string
    setType: (type: string) => void

    initialize: () => void
}

export const DashboardContext = createContext<IDashboardProps | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
    const [branchList, setBranchList] = useState<Array<ISucursal>>([])
    const [branchSelected, setBranchSelected] = useState<ISucursal[]>([]);
    const [branchPatternList, setbranchPatternList] = useState<Array<IDataSet>>([])
    const [cardIndicatorSelected, setCardIndicatorSelected] = useState<Array<string>>(['avgStartHour_avgEndHour','stdStartHour_stdEndHour']);
    const [type, setType] = useState('weeklyWorkAvg')
    const [pending, setPending] = useState(true)

    const { currentEntity } = useEntity()


    const initialize = async () => {
        setPending(true)
        const branchList = await search(currentEntity?.entity?.id as string, { ...{} as any, limit: 100 })
        setBranchList(branchList)   
        setPending(false)
    }

    const onSelectedBranch = async () => {
        const branchPatternListData: Array<IDataSet> = []
        await Promise.all(branchSelected.map(async (branch, i) => {
            branchPatternListData.push({
                branch,
                pattern: await fetchBranchPattern(currentEntity?.entity?.id as string, branch.id as string) as IBranchPattern,
                color: colors[i]
            })
        }))
        console.log(branchPatternListData);        
        setbranchPatternList(branchPatternListData)
    }


    useEffect(() => {
       
        if (currentEntity?.entity?.id) {
            onSelectedBranch()
        }
    }, [branchSelected.length, currentEntity?.entity?.id])


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
        <DashboardContext.Provider value={{ initialize , preferenceItems, type, setType, branchPatternList, cardIndicatorSelected, setCardIndicatorSelected, branchList, branchSelected, setBranchSelected, pending }}>
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