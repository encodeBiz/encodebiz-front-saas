'use client'
import React, { createContext, useContext, useState } from 'react';
import { IPassIssuedStatsRequest } from '../model/PassIssued';
import { IPassValidatorStatsRequest } from '../model/PassValidator';
import { IPassTrendStatsRequest } from '../model/PassTrend';


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

const defaultValuePASSES_TREND = {
    "entityId": "k24rpxzY7aUTAmSXjNyT",
    "stats": "PASSES_ISSUED_GENERAL",
    "groupBy": "month",
    "type": "entity",
    "dateRange": {
        "start": "2025-01-01T00:00:00.000Z",
        "end": "2025-12-31T23:59:59.000Z"
    }
}
interface IPassinBizStatsProps {
    payloadPassIssued: IPassIssuedStatsRequest,
    setPayloadPassIssued: (payloadPassIssued: IPassIssuedStatsRequest) => void

    payloadPassValidator: IPassValidatorStatsRequest,
    setPayloadPassValidator: (payloadPassIssued: IPassValidatorStatsRequest) => void

    payloadPassTrend: IPassTrendStatsRequest,
    setPayloadPassTrend: (payloadPassIssued: IPassTrendStatsRequest) => void


    seriesChart2: Array<{ id: string, name: string }>,
    setSeriesChart2: (payloadPassIssued: Array<{ id: string, name: string }>) => void
}

export const PassinBizStatsContext = createContext<IPassinBizStatsProps | undefined>(undefined);



export function PassinBizStatsProvider({ children }: { children: React.ReactNode }) {
    const [payloadPassIssued, setPayloadPassIssued] = useState<IPassIssuedStatsRequest>(defaultValuePASSES_ISSUED as IPassIssuedStatsRequest)
    const [payloadPassValidator, setPayloadPassValidator] = useState<IPassValidatorStatsRequest>(defaultValuePASSES_VALIDATION as IPassValidatorStatsRequest)
    const [payloadPassTrend, setPayloadPassTrend] = useState<IPassTrendStatsRequest>(defaultValuePASSES_TREND as IPassTrendStatsRequest)

    const [seriesChart2, setSeriesChart2] = useState<Array<{ id: string, name: string }>>([])

    return (
        <PassinBizStatsContext.Provider value={{ seriesChart2, payloadPassTrend, setPayloadPassTrend, setSeriesChart2, payloadPassIssued, setPayloadPassIssued, payloadPassValidator, setPayloadPassValidator }}>
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