'use client'
import React, { createContext, useContext, useState } from 'react';
import { IPassIssuedStatsRequest } from '../model/PassIssued';
import { IPassValidatorStatsRequest } from '../model/PassValidator';
import { IPassTrendStatsRequest } from '../model/PassTrend';




interface IPassinBizStatsProps {
    payloadPassIssued: IPassIssuedStatsRequest | undefined,
    payloadPassIssuedFilter: IPassIssuedStatsRequest | undefined,
    setPayloadPassIssued: (payloadPassIssued: IPassIssuedStatsRequest) => void

    payloadPassValidator: IPassValidatorStatsRequest | undefined,
    payloadPassValidatorFilter: IPassValidatorStatsRequest | undefined,
    setPayloadPassValidator: (payloadPassIssued: IPassValidatorStatsRequest) => void

    payloadPassTrend: IPassTrendStatsRequest | undefined,
    setPayloadPassTrend: (payloadPassIssued: IPassTrendStatsRequest) => void

    lastUseFilter: any,
    setLastUseFilter: (lastUseFilter: any) => void

    graphData: any,
    setGraphData: (graphData: any) => void

    seriesChart2: Array<{ id: string, name: string }>,
    setSeriesChart2: (payloadPassIssued: Array<{ id: string, name: string }>) => void

    applyFilter: (type: "issued" | "validator" | "trend") => void
}

export const PassinBizStatsContext = createContext<IPassinBizStatsProps | undefined>(undefined);



export function PassinBizStatsProvider({ children }: { children: React.ReactNode }) {

    const [payloadPassIssued, setPayloadPassIssued] = useState<IPassIssuedStatsRequest>({
        "dateRange": {
            start: new Date(new Date().getFullYear(), 0, 1),
            end: new Date()
        },
        "groupBy": "month",
        "type": "",
        "passStatus": "active",
    } as IPassIssuedStatsRequest)
    const [payloadPassValidator, setPayloadPassValidator] = useState<IPassValidatorStatsRequest>({

        "dateRange": {
            start: new Date(new Date().getFullYear(), 0, 1),
            end: new Date()
        },
        "groupBy": "month",
        "type": "",
        "passStatus": "active",


    } as IPassValidatorStatsRequest)
    const [payloadPassTrend, setPayloadPassTrend] = useState<IPassTrendStatsRequest>()

    const [seriesChart2, setSeriesChart2] = useState<Array<{ id: string, name: string }>>([])

    const [payloadPassIssuedFilter, setPayloadPassIssuedFilter] = useState<IPassIssuedStatsRequest>()
    const [payloadPassValidatorFilter, setPayloadPassValidatorFilter] = useState<IPassValidatorStatsRequest>()

    const [lastUseFilter, setLastUseFilter] = useState<any>({ 'issued': {}, 'validator': {} })
    const [graphData, setGraphData] = useState<any>({ 'issued': {}, 'validator': {} })


    const applyFilter = (type: "issued" | "validator" | "trend") => {
        switch (type) {
            case "issued":
                setPayloadPassIssuedFilter(payloadPassIssued)
                break;
            case "validator":
                setPayloadPassValidatorFilter(payloadPassValidator)
                break;
            default:
                break;
        }
    }
    return (
        <PassinBizStatsContext.Provider value={{ graphData, setGraphData, lastUseFilter, setLastUseFilter, applyFilter, payloadPassIssuedFilter, payloadPassValidatorFilter, seriesChart2, payloadPassTrend, setPayloadPassTrend, setSeriesChart2, payloadPassIssued, setPayloadPassIssued, payloadPassValidator, setPayloadPassValidator }}>
            {children}
        </PassinBizStatsContext.Provider>
    );
}


export const usePassinBizStats = () => {
    const context = useContext(PassinBizStatsContext);
    if (!context) {
        throw new Error("usePassinBizStats must be used within an PassinBizStatsContext");
    }
    return context;
};