import { IStatsRequest, IStatsResponse, GroupBy, BucketItem } from "@/domain/features/passinbiz/IStats";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useToast } from "@/hooks/useToast";
import { normalizeApiResponse, getBuckets, buildChartData, computeTotalsByEvent } from "@/lib/common/stats";
import { fetchStats } from "@/services/passinbiz/holder.service";
import React, { useState, useEffect } from "react";



export interface ChartData {
    buckets: Record<string, BucketItem[]>,
    rows: any,
    series: any,
    ranking: any,
    dr: { start: string, end: string } | undefined,
    empty: boolean
    data: IStatsResponse
}

export default function usePassesIssuedRankingController() {


    const [loading, setLoading] = useState(false);

    //Graph Data
    const [graphData, setGraphData] = useState<ChartData>()
    const { token } = useAuth()
    const { showToast } = useToast()
    async function handleFetchStats(payload: IStatsRequest) {
        setLoading(true);
        fetchStats({ ...payload } as IStatsRequest, token).then(res => {
            const normalized = normalizeApiResponse(res);
            const buckets = getBuckets(normalized as IStatsResponse, payload.groupBy)
            const { rows, series } = buildChartData(buckets, payload.groupBy)
            const ranking = computeTotalsByEvent(buckets)
            const dr = normalized?.dateRange ?? (normalized as IStatsResponse)?.dateRange;
            const empty = rows.length === 0 || series.length === 0;

            setGraphData({
                buckets, rows, series, ranking, dr, empty, data: normalized
            })

        }).catch(e => {
            showToast(e?.message, 'error')
        }).finally(() => {
            setLoading(false)
        })
    }





    return {
        handleFetchStats, loading, graphData
    }

}