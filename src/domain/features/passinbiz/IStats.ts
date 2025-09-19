export type GroupBy = "hour" | "day" | "month";

export type BucketItem = { total: number; event: string; eventId?: string };


export interface IStatsRequest {

    entityId?: string,
    stats: "PASSES_ISSUED" | "PASSES_VALIDATION",
    dateRange: {
        start: any,
        end: any
    },
    groupBy: GroupBy,
    type: "event" | "credential",
    passStatus?: 'not_generated' | 'pending' | 'active' | 'revoked' | 'failed' | 'archived';
    events?: Array<{ id: string, name: string }>
}