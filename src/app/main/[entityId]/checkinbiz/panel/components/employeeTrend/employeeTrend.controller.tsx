/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useEntity } from "@/hooks/useEntity";
import { EmployeeStats, getEmployeeStatsByYear } from "@/services/checkinbiz/employee.service";
import { useTranslations } from "next-intl";



export default function useEmployeeTrendChart() {
    const { currentEntity } = useEntity()
    const t = useTranslations
    const [loading, setLoading] = useState(false);
    //Graph Data
    const [graphData, setGraphData] = useState<EmployeeStats>()

    async function handleFetchStats() {
        setLoading(true);
        const data = await getEmployeeStatsByYear(currentEntity?.entity.id as any, new Date().getFullYear(), {} as any)
 
        setGraphData(data)
        setLoading(false);
    }

    useEffect(() => {
        if (currentEntity?.entity.id)
            handleFetchStats()

    }, [currentEntity?.entity.id])



    return {
        loading, graphData
    }

}