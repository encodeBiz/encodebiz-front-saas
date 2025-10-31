import { Timestamp } from "firebase/firestore"

export interface IBranchPattern {
    "id": string
    "updatedAt": Timestamp
    "reliability": number
    "entityId": string
    "createdAt": Timestamp
    "dataPoints": number
    "branchId": string
    "stdStartHour": number
    "stdEndHour": number
    "avgEndHour": number
    "weeklyWorkAvg": Array<number | null>
    "avgStartHour": number
    "source": "init_config" | string
    "weeklyEndAvg": Array<number | null>
    "weeklyStartAvg": Array<number | null>
    "timeZone": string
    "totalItems": number
    "last": string

    "avgCostHour": number,
    "avgCycleCost": number,
    "avgEffectiveCost": number,
    "efficiency": number,
    "cycleTime": number,
    costTrend: any
    costVariance: number
    effectiveRealCost: number
}






