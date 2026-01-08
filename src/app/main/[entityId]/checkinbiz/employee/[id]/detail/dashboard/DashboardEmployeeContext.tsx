'use client'
import React, { createContext, useContext, useState } from 'react';

import { ISucursal } from '@/domain/features/checkinbiz/ISucursal';
import { useEntity } from '@/hooks/useEntity';
import { IEmployeePattern, IHeuristicIndicator, IRulesInfo } from '@/domain/features/checkinbiz/IStats';
import { fetchHeuristic, fetchEmployeePattern, fetchHeuristicsIndicator } from '@/services/checkinbiz/stats.service';
import { useAuth } from '@/hooks/useAuth';
import { useAppLocale } from '@/hooks/useAppLocale';
import { IEmployee } from '@/domain/features/checkinbiz/IEmployee';
import { fetchEmployee } from '@/services/checkinbiz/employee.service';


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

    employeePatternList: Array<{
        pattern: IEmployeePattern,
        employeeId: string,
        employee: IEmployee
    }>,
    pending?: boolean
    heuristicsItems: Array<{ name: string, children: Array<{ name: string, value: string, description: string }> }>
    cardIndicatorSelected: Array<string>
    setCardIndicatorSelected: (data: Array<string>) => void
    type: string
    setType: (type: string) => void

    initialize: () => void
    heuristic: Array<IRulesInfo>
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


export const DashboardEmployeeContext = createContext<IDashboardEmployeeProps | undefined>(undefined);

export const DashboardEmployeeProvider = ({ children, employeeId }: { children: React.ReactNode, employeeId: string }) => {

    const [employeePatternList, setEmployeePatternList] = useState<Array<{
        pattern: IEmployeePattern,
        employeeId: string,
        employee: IEmployee
    }>>([])
    const [cardIndicatorSelected, setCardIndicatorSelected] = useState<Array<string>>(['avgStartHour_avgEndHour', 'stdStartHour_stdEndHour']);
    const [heuristicsItems, setHeuristicsItems] = useState<Array<{ name: string, children: Array<{ name: string, value: string, description: string }> }>>([])
    const [heuristic, setHeuristic] = useState<Array<IRulesInfo>>([])
    const [heuristicData, setHeuristicData] = useState<Array<IHeuristicIndicator>>([])
    const { token } = useAuth()
    const { currentLocale } = useAppLocale()
    const [type, setType] = useState('weeklyWorkAvg')
    const [pending, setPending] = useState(true)

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
        const employee: IEmployee = await fetchEmployee(currentEntity?.entity.id as string, employeeId) as IEmployee
        const branchPatternList: Array<IEmployeePattern> = await fetchEmployeePattern(currentEntity?.entity?.id as string, employeeId as string) as Array<IEmployeePattern>
        buildHeuristicInfo()
        const KEY = 'PANEL_EMPLOYEE_CHECKBIZ_CHART_' + employeeId
        setCardIndicatorSelected(localStorage.getItem(KEY) ? JSON.parse(localStorage.getItem(KEY) as string)?.preferenceSelected ?? [...defaultItems1] : [...defaultItems1])

        const KEY_TYPE = 'PANEL_EMPLOYEE_CHECKBIZ_CHART_TIME_' + employeeId
        setType(localStorage.getItem(KEY_TYPE) ? localStorage.getItem(KEY_TYPE) as string : 'weeklyWorkAvg')

        setEmployeePatternList(branchPatternList.map(e => ({
            pattern: e,
            employee,
            employeeId
        })))
        try {
            const data: Array<IRulesInfo> = await fetchHeuristic(currentEntity?.entity?.id as string, null, employeeId, token, currentLocale)
            setHeuristic(data);
        } catch {
            setHeuristic([])}
        setPending(false)

    }





    return (
        <DashboardEmployeeContext.Provider value={{ employeePatternList, heuristicData, employeeId, heuristic, heuristicsItems, initialize, type, setType, cardIndicatorSelected, setCardIndicatorSelected, pending }}>
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