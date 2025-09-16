export type GroupBy = "hour" | "day" | "month";

export type BucketItem = { total: number; event: string; eventId?: string };

export interface IStatsResponse {
    total: number;
    hour?: Record<string, BucketItem[]>;
    day?: Record<string, BucketItem[]>;
    month?: Record<string, BucketItem[]>;
    dateRange?: { start: string; end: string };
    meta?: any;
}

export interface IStatsRequest {

    entityId: string,
    stats: "PASSES_ISSUED",
    dateRange: {
        start: Date,
        end: Date
    },
    groupBy: GroupBy,
    type: "event",
    passStatus: 'not_generated' | 'pending' | 'active' | 'revoked' | 'failed' | 'archived';
    events: Array<{ id: string, name: string }>
}