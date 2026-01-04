import IUser from "@/domain/core/auth/IUser";
import { IEmployee } from "./IEmployee";
import { ISucursal } from "./ISucursal";

export interface IUpdateRequest {
    createdAt: any
    id: number
    previousDate: string
    previousStatus: string
    reason: string
    updateBy: string
    admin?:IUser
    employee?: IEmployee
    data: {
        employeeId: string
        entityId: string
        id: string
        status: string
        timestamp: any
    }
}
export interface IChecklog {
    id?: string; // uid
    "employeeId": string
    "entityId": string
    "branchId": string
    "type": "checkout" | "checkin" | "restin" | "restout"
    "geo": {
        "lat": number,
        "lng": number
    }
    timestamp?: any
    userAgent?: any
    status: 'valid' | "failed" | 'pending-employee-validation'
    failedCode?: string

    reason?: string
    updateId?: string
    requestUpdate?: string

    metadata?: {
        requestUpdates?: Array<IUpdateRequest>
    } & any
    branch?: ISucursal
    employee?: IEmployee
    requestUpdateData?: IUpdateRequest | null
}


export interface ICreateLog {
    "employeeId": string
    "entityId": string
    "branchId": string
    "type": "checkout" | "checkin" | "restin" | "restout"
    "geo": {
        "lat": number,
        "lng": number
    }

}