/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';

import { ISucursal } from '@/domain/features/checkinbiz/ISucursal';
import { search } from '@/services/checkinbiz/sucursal.service';
import { useEntity } from '@/hooks/useEntity';
import { IBranchPattern, IHeuristicInfo } from '@/domain/features/checkinbiz/IStats';
import { analiziHeuristic, fetchBranchPattern } from '@/services/checkinbiz/stats.service';
import { useAuth } from '@/hooks/useAuth';
import { useAppLocale } from '@/hooks/useAppLocale';
 import { errorDict } from '@/config/errorLocales';




interface ICheckBizStatsProps {
    branchList: Array<ISucursal>
    branchSelected: Array<ISucursal>,
    setBranchSelected: (items: Array<ISucursal>) => void

    branchOne: IBranchPattern | null
    branchTwo: IBranchPattern | null

    pending?: boolean
    heuristicDataOne: Array<IHeuristicInfo>
    heuristicDataTwo: Array<IHeuristicInfo>
    setHeuristicDataOne: (data: Array<IHeuristicInfo>) => void
    setHeuristicDataTwo: (data: Array<IHeuristicInfo>) => void

    cardIndicatorSelected: Array<string>
    setCardIndicatorSelected: (data: Array<string>) => void
    heuristicAnalizeError: string
    type: string
    setType:(type: string)=>void
}

export const CheckBizStatsContext = createContext<ICheckBizStatsProps | undefined>(undefined);

export const CheckBizStatsProvider = ({ children }: { children: React.ReactNode }) => {
    const [branchList, setBranchList] = useState<Array<ISucursal>>([])
    const [branchSelected, setBranchSelected] = useState<ISucursal[]>([]);
    const [cardIndicatorSelected, setCardIndicatorSelected] = useState<string[]>([]);
    const [heuristicAnalizeError, setHeuristicAnalizeError] = useState('')
    const [type, setType] = useState('weeklyWorkAvg')
    const [pending, setPending] = useState(true)
    const { token } = useAuth()
    const { currentLocale } = useAppLocale()
    const [branchOne, setBranchOne] = useState<IBranchPattern | null>(null);
    const [branchTwo, setBranchTwo] = useState<IBranchPattern | null>(null);
    const [heuristicDataOne, setHeuristicDataOne] = useState<Array<IHeuristicInfo>>([])
    const [heuristicDataTwo, setHeuristicDataTwo] = useState<Array<IHeuristicInfo>>([])

    const { currentEntity } = useEntity()


    const initialize = async () => {
        const branchList = await search(currentEntity?.entity?.id as string, { ...{} as any, limit: 100 })
        setBranchList(branchList)
        if (branchList.length > 0) setBranchSelected([branchList[0]])
        else setPending(false)
    }

    const updatePatternData = async () => {
        setPending(true)

        if (branchSelected.length == 0) {
            setBranchTwo(null)
            setBranchOne(null)
        }
        if (branchSelected.length == 1) {
            setBranchOne(await fetchBranchPattern(currentEntity?.entity?.id as string, branchSelected[0].id as string) as IBranchPattern);
            setBranchTwo(null)
        }
        if (branchSelected.length == 2) {
            setBranchTwo(await fetchBranchPattern(currentEntity?.entity?.id as string, branchSelected[1].id as string) as IBranchPattern);
            setBranchOne(await fetchBranchPattern(currentEntity?.entity?.id as string, branchSelected[0].id as string) as IBranchPattern);
        }

        setCardIndicatorSelected(localStorage.getItem('cardIndicatorSelected') ? JSON.parse(localStorage.getItem('cardIndicatorSelected') as string) : ['avgStartEnd',
            'avgCycleCost',
            'avgCostHour',
            'avgWeekWork',
            'rentability'])
        setPending(false)
    }

    const fetchHeuristic = async () => {
        if (branchSelected.length == 0) {
            setHeuristicDataOne([])
            setHeuristicDataTwo([])
        }

        try {
            setHeuristicAnalizeError('')
            if (branchSelected.length == 1) {
                const data: Array<IHeuristicInfo> = await analiziHeuristic(currentEntity?.entity?.id as string, branchSelected[0].id as string, token, currentLocale)
                setHeuristicDataOne(data.map((e, i) => ({ ...e, active: i < 8 ? true : false })));
                setHeuristicDataTwo([])
            }

            if (branchSelected.length == 2) {
                const data1: Array<IHeuristicInfo> = await analiziHeuristic(currentEntity?.entity?.id as string, branchSelected[0].id as string, token, currentLocale)
                setHeuristicDataOne(data1.map((e, i) => ({ ...e, active: i < 8 ? true : false })));

                const data2: Array<IHeuristicInfo> = await analiziHeuristic(currentEntity?.entity?.id as string, branchSelected[1].id as string, token, currentLocale)
                setHeuristicDataTwo(data2.map((e, i) => ({ ...e, active: i < 8 ? true : false })));
            }
        } catch (error: any) {
            const data = JSON.parse(error.message as string)
            if (data.code === 'analyze/insufficient_data') {
                setHeuristicAnalizeError(errorDict[currentLocale][data.code])
            }
        }



    }
    useEffect(() => {
        initialize()
    }, [currentEntity?.entity?.id])


    useEffect(() => {
        if (currentEntity?.entity?.id) {
            updatePatternData()
            if (branchSelected.length > 0)
                fetchHeuristic()
        }
    }, [branchSelected.length, currentEntity?.entity?.id])



    return (
        <CheckBizStatsContext.Provider value={{type, setType, heuristicAnalizeError, cardIndicatorSelected, setCardIndicatorSelected, heuristicDataOne, setHeuristicDataOne, heuristicDataTwo, setHeuristicDataTwo, branchList, branchSelected, setBranchSelected, branchOne, branchTwo, pending }}>
            {children}
        </CheckBizStatsContext.Provider>
    );
}


export const useCheckBizStats = () => {
    const context = useContext(CheckBizStatsContext);
    if (!context) {
        throw new Error("useCheckBizStats must be used within an CheckBizStatsContext");
    }
    return context;
};