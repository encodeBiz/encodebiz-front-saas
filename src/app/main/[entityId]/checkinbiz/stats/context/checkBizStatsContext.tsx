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

    branchOne: IBranchPattern | undefined
    branchTwo: IBranchPattern | undefined
}

export const CheckBizStatsContext = createContext<ICheckBizStatsProps | undefined>(undefined);



export function CheckBizStatsProvider({ children }: { children: React.ReactNode }) {
    const [branchList, setBranchList] = useState<Array<ISucursal>>([])
    const [branchSelected, setBranchSelected] = React.useState<ISucursal[]>([]);

    const [branchOne, setBranchOne] = React.useState<IBranchPattern>();
    const [branchTwo, setBranchTwo] = React.useState<IBranchPattern>();

    const { currentEntity } = useEntity()

    const initialize = async () => {
        setBranchList(await search(currentEntity?.entity?.id as string, { ...{} as any, limit: 100 }))
    }

    const updatePatternData = async () => {
 
        if (branchSelected.length == 1)
            setBranchOne(await fetchBranchPattern(currentEntity?.entity?.id as string, branchSelected[0].id as string) as IBranchPattern);
        if (branchSelected.length == 2) {
            setBranchTwo(await fetchBranchPattern(currentEntity?.entity?.id as string, branchSelected[1].id as string) as IBranchPattern);
            setBranchOne(await fetchBranchPattern(currentEntity?.entity?.id as string, branchSelected[0].id as string) as IBranchPattern);
        }
    }
    useEffect(() => {
        initialize()
    }, [currentEntity?.entity?.id])


    useEffect(() => {
        updatePatternData()
    }, [branchSelected.length])

    return (
        <CheckBizStatsContext.Provider value={{ branchList, branchSelected, setBranchSelected, branchOne, branchTwo }}>
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