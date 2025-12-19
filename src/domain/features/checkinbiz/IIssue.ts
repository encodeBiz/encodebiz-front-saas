import IUser from "@/domain/core/auth/IUser"
import { IEmployee } from "./IEmployee"
import { ISucursal } from "./ISucursal"

export interface IIssue {
    branchId: string
    branch?: ISucursal
    employee?: IEmployee
    comments: string
    createdAt: any
    employeeId: string
    entityId: string
    fromRole: "worker" | "supervisor"
    id: string
    includeLocation: boolean
    localtion: {
        latitude: number
        longiude: number
    }
    responseCount: number
    state: 'resolved' | "in_review" | "pending"
    toRole: "worker" | "supervisor"
    type: string
    userId: string
}

export interface IIssueResponse {
    createdAt: any
    employeeId: string
    employee?: IEmployee
    id: string
    issueId: string
    message: string
    newState: string
    oldState: string
    userId: string
    user?:IUser

    totalItems?:number
}