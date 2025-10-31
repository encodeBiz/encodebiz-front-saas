/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';

import { ISucursal } from '@/domain/features/checkinbiz/ISucursal';
import { search } from '@/services/checkinbiz/sucursal.service';
import { useEntity } from '@/hooks/useEntity';
import { IBranchPattern } from '@/domain/features/checkinbiz/IStats';
import { fetchBranchPattern } from '@/services/checkinbiz/stats.service';




interface ICheckBizStatsProps {
    branchList: Array<ISucursal>
    branchSelected: Array<ISucursal>,
    setBranchSelected: (items: Array<ISucursal>) => void

    branchOne: IBranchPattern | null
    branchTwo: IBranchPattern | null

    pending?: boolean
}

export const CheckBizStatsContext = createContext<ICheckBizStatsProps | undefined>(undefined);

export const CheckBizStatsProvider = ({ children }: { children: React.ReactNode }) => {
    const [branchList, setBranchList] = useState<Array<ISucursal>>([])
    const [branchSelected, setBranchSelected] = useState<ISucursal[]>([]);
    const [pending, setPending] = useState(false)

    const [branchOne, setBranchOne] = useState<IBranchPattern | null>(null);
    const [branchTwo, setBranchTwo] = useState<IBranchPattern | null>(null);

    const { currentEntity } = useEntity()


    const initialize = async () => {
        setBranchList(await search(currentEntity?.entity?.id as string, { ...{} as any, limit: 100 }))
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
        setPending(false)
    }
    useEffect(() => {
        initialize()
    }, [currentEntity?.entity?.id])


    useEffect(() => {
        updatePatternData()
    }, [branchSelected.length])



    return (
        <CheckBizStatsContext.Provider value={{ branchList, branchSelected, setBranchSelected, branchOne, branchTwo, pending }}>
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