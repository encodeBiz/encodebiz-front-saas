export interface IIssue {
    branchId: string
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
    state: string
    toRole: "supervisor"
    type: string
    userId: string
}

export interface IResponse {
    createdAt: any
    employeeId: string
    id: string
    issueId: string
    message: string
    newState: string
    oldState: string
    userId: string
}