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

    ref?: {
        url: string
        path: string
    }
}


