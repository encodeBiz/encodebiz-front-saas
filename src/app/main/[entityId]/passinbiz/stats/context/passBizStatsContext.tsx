'use client'
import React, { createContext, useContext, useState } from 'react';
import { IPassIssuedStatsRequest } from '../model/PassIssued';
import { IPassValidatorStatsRequest } from '../model/PassValidator';
import { IPassTrendStatsRequest } from '../model/PassTrend';
import { rmNDay } from '@/lib/common/Date';


 
const defaultValuePASSES_ISSUED = {
    "entityId": "z1YRV6s6ueqnJpIvInFL",
    "stats": "PASSES_ISSUED",
    "dateRange": {
        "start": "2025-09-12T09:00:00.000Z",
        "end": "2025-09-12T22:00:00.000Z"
    },
    "groupBy": "hour",
    "type": "event",
    "passStatus": "active",
    "events": [
        {
            "id": "DAhykI0IAJAWA9Ip9TGW",
            "name": "Masterclass GROUND"
        },
        {
            "id": "ItjpMhJf4dJAkbZR5zkf",
            "name": "Presentación de PassBiz"
        }
    ]
}


const defaultValuePASSES_VALIDATION = {
    entityId: "z1YRV6s6ueqnJpIvInFL",
    stats: "PASSES_VALIDATION", // <-- importante
    dateRange: {
        start: "2025-09-16T09:00:00.000Z",
        end: "2025-09-16T22:00:00.000Z",
    },
    groupBy: "hour",
    type: "event",
    passStatus: "active",
    events: [
        { id: "DAhykI0IAJAWA9Ip9TGW", name: "Masterclass GROUND" },
        { id: "ItjpMhJf4dJAkbZR5zkf", name: "Presentación de PassBiz" },
    ],
}

interface IPassinBizStatsProps {
    payloadPassIssued: IPassIssuedStatsRequest | undefined,
    payloadPassIssuedFilter: IPassIssuedStatsRequest | undefined,
    setPayloadPassIssued: (payloadPassIssued: IPassIssuedStatsRequest) => void

    payloadPassValidator: IPassValidatorStatsRequest | undefined,
    payloadPassValidatorFilter: IPassValidatorStatsRequest | undefined,
    setPayloadPassValidator: (payloadPassIssued: IPassValidatorStatsRequest) => void

    payloadPassTrend: IPassTrendStatsRequest | undefined,
    setPayloadPassTrend: (payloadPassIssued: IPassTrendStatsRequest) => void


    seriesChart2: Array<{ id: string, name: string }>,
    setSeriesChart2: (payloadPassIssued: Array<{ id: string, name: string }>) => void

    applyFilter: (type: "issued" | "validator" | "trend") => void
}

export const PassinBizStatsContext = createContext<IPassinBizStatsProps | undefined>(undefined);



export function PassinBizStatsProvider({ children }: { children: React.ReactNode }) {

    const [payloadPassIssued, setPayloadPassIssued] = useState<IPassIssuedStatsRequest>({
        "dateRange": {
            "start": rmNDay(new Date(), 5),
            "end": new Date()
        },
        "groupBy": "day",
        "type": "credential",
        "passStatus": "active",
    } as IPassIssuedStatsRequest)
    const [payloadPassValidator, setPayloadPassValidator] = useState<IPassValidatorStatsRequest>({
        /*
        "dateRange": {
            "start": rmNDay(new Date(), 5),
            "end": new Date()
        },
        "groupBy": "day",
        "type": "credential",
        "passStatus": "active",
        */
        ...defaultValuePASSES_VALIDATION
    } as IPassValidatorStatsRequest)
    const [payloadPassTrend, setPayloadPassTrend] = useState<IPassTrendStatsRequest>()

    const [seriesChart2, setSeriesChart2] = useState<Array<{ id: string, name: string }>>([])

    const [payloadPassIssuedFilter, setPayloadPassIssuedFilter] = useState<IPassIssuedStatsRequest>()
    const [payloadPassValidatorFilter, setPayloadPassValidatorFilter] = useState<IPassValidatorStatsRequest>()



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
        <PassinBizStatsContext.Provider value={{ applyFilter, payloadPassIssuedFilter, payloadPassValidatorFilter, seriesChart2, payloadPassTrend, setPayloadPassTrend, setSeriesChart2, payloadPassIssued, setPayloadPassIssued, payloadPassValidator, setPayloadPassValidator }}>
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