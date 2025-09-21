export type GroupBy = "hour" | "day" | "month";
export type BucketItem = { total: number; event: string; eventId?: string };
export interface IPassTrendStatsRequest {
    entityId?: string,
    stats: "PASSES_ISSUED_GENERAL",
    dateRange: {
        start: any,
        end: any
    },
    groupBy: "month",
    type: "entity",
   
}

  

export interface IPassTrendStatsResponse {
    dr: any
    empty: any 
    trend: any
    data: any
    meta?: any;
}