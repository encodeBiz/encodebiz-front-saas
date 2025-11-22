export interface IReport {
    id?: string;
    branchId?: string | null
    entityId: string
    start: string
    end: string
    status: string
    branch?: string
    employee?: string
    entity?: string
    createdAt?: any;
    ref?: {
        url: string
        path: string
    }
}


