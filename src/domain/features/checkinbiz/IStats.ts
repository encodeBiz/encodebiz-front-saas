import { Timestamp } from "firebase/firestore"
import { ISucursal } from "./ISucursal"

export interface IBranchPattern {
    "id": string
    "updatedAt": Timestamp
    "rentability": number
    "entityId": string
    "createdAt": Timestamp
    "dataPoints": number
    "branchId": string
    "stdStartHour": number
    "stdEndHour": number
    "avgEndHour": number
    "avgStartHour": number
    "source": "init_config" | string
    "weeklyEndAvg": Array<number | null>
    "weeklyStartAvg": Array<number | null>
    "weeklyWorkAvg": Array<number | null>

    "timeZone": string
    "totalItems": number
    "last": string

    "avgCostHour": number,
    "avgCycleCost": number,
    "avgEffectiveCost": number,
    avgCostEfficiency: number,
    "efficiency": number,
    "cycleTime": number,
    costTrend: any
    costVariance: number
    effectiveRealCost: number

    branch?: ISucursal
}



export interface IHeuristicInfo {
    "id": string
    "value": number,
    "name": {
        "es": string
        "en": string
    },
    "status": "error" | 'warning' | 'info',
    "label": string
    "consequence": string
    "action": string

    active: boolean
}


