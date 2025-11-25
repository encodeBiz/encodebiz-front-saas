/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import ChartLine from '@/components/common/help/ChartLine';
import { IBranchPattern, IEmployeePattern } from '@/domain/features/checkinbiz/IStats';

const ChartActivity = ({ type, branchPatternList }: any) => {
    const [chartData, setChartData] = useState<Array<Record<string, number>>>([])
    const updateChartData = async () => {
         
        const chartDataList: Array<Record<string, number>> = Array(7).fill(0)
        if (branchPatternList.length > 0) {
            chartDataList.forEach((_, i) => {
                const item = {}
                branchPatternList.map((e: any)=>e.pattern).forEach((patternBranch: IBranchPattern | IEmployeePattern) => {
                    const value = parseFloat(`${(patternBranch as any)[type][i].toFixed(2)}`)
                    Object.assign(item, {
                        [(patternBranch as IBranchPattern).branch?.name as string]: value
                    })
                });
                chartDataList.push(item)
            });
        }         
        setChartData(chartDataList)
    }
    useEffect(() => {
        updateChartData()
    }, [branchPatternList.length, type])
    return (
        <ChartLine data={chartData} />
    );
};

export default ChartActivity;
