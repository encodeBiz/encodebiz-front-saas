export type GroupBy = "hour" | "day" | "month";
export type BucketItem = { total: number; event: string; eventId?: string };
export interface IPassValidatorStatsRequest {
    entityId?: string,
    stats: "PASSES_VALIDATION",
    dateRange: {
        start: any,
        end: any
    },
    groupBy: GroupBy,
    type: "event" | "credential" | "" ,
    passStatus?: 'not_generated' | 'pending' | 'active' | 'revoked' | 'failed' | 'archived';
    events?: Array<{ id: string, name: string }>
    series?: Array<{ id: string, name: string }>
}

export interface IPassValidatorStatsResponse {
    total: number;
    hour?: Record<string, BucketItem[]>;
    day?: Record<string, BucketItem[]>;
    month?: Record<string, BucketItem[]>;
    dateRange?: { start: string; end: string };
    meta?: any;
}