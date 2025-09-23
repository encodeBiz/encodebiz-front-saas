import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

import { fetchStats } from "@/services/passinbiz/holder.service";
import { useState } from "react";
import { BucketItem, GroupBy, IPassIssuedStatsRequest, IPassIssuedStatsResponse } from "../../../model/PassIssued";
import { usePassinBizStats } from "../../../context/passBizStatsContext";




function normalizeApiResponse(json: any): IPassIssuedStatsResponse {
    const root = json?.result ?? json?.output ?? json?.data ?? json ?? {};
    const hour = root.hour ?? root.hours ?? root.hourly;
    const day = root.day ?? root.days ?? root.daily;
    const month = root.month ?? root.months ?? root.monthly;
    const total = root.total ?? root.kpis?.total ?? root.kpis?.totalIssued ?? 0;
    const dateRange = root.dateRange ?? root.meta?.dateRangeApplied ?? undefined;
    return { total, hour, day, month, dateRange, meta: root.meta } as IPassIssuedStatsResponse;
}

function getBuckets(resp: IPassIssuedStatsResponse, gb: GroupBy) {
    return (resp?.[gb] ?? {}) as Record<string, BucketItem[]>;
}

function sortKeys(gb: GroupBy, keys: string[]) {
    if (gb === "hour") return keys.map(Number).sort((a, b) => a - b).map(String);
    return keys.sort((a, b) => a.localeCompare(b)); // YYYY-MM(-DD)
}

function uniq<T>(arr: T[]): T[] { return Array.from(new Set(arr)); }

function safeKey(s: string) {
    return s
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^A-Za-z0-9_]/g, "_");
}

// Color aleatorio determinista por serie (alto contraste)
const PALETTE = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    "#023047", "#fb8500", "#219ebc", "#8ecae6", "#ffb703",
    "#6a994e", "#e76f51", "#8338ec", "#3a86ff", "#ff006e"
];
function hashString(str: string) {
    let h = 2166136261 >>> 0; // FNV-1a
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
}
function colorFor(key: string) {
    return PALETTE[hashString(key) % PALETTE.length];
}

function buildChartData(buckets: Record<string, BucketItem[]>, gb: GroupBy) {
    const keys = sortKeys(gb, Object.keys(buckets));
    const eventNames = uniq(keys.flatMap((k) => (buckets[k] || []).map((i) => i.event)));
    const series = eventNames.map((name) => {
        const field = safeKey(name);
        return { name, field, color: colorFor(field) };
    });

    let cumulative = 0;
    const rows = keys.map((k) => {
        const row: any = { key: k };
        let total = 0;
        for (const s of series) {
            const found = (buckets[k] || []).find((i) => i.event === s.name);
            const v = found ? found.total : 0;
            row[s.field] = v;
            total += v;
        }
        cumulative += total;
        row.total = total;
        row.cumulative = cumulative;
        row.label = gb === "hour" ? `${String(k).padStart(2, "0")}:00` : k;
        return row;
    });

    return { rows, series };
}

function computeTotalsByEvent(buckets: Record<string, BucketItem[]>) {
    const map = new Map<string, { event: string; total: number }>();
    Object.keys(buckets).forEach((k) => {
        (buckets[k] || []).forEach((item) => {
            const key = item.event; // o item.eventId ?? item.event
            const prev = map.get(key) ?? { event: item.event, total: 0 };
            prev.total += item.total || 0;
            map.set(key, prev);
        });
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export function formatCompact(n: number) {
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(n);
}
export interface ChartData {
    buckets: Record<string, BucketItem[]>,
    rows: any,
    series: any,
    ranking: any,
    dr: { start: string, end: string } | undefined,
    empty: boolean
    data: IPassIssuedStatsResponse
}

export default function usePassesIssuedController() {

   
    //Graph Data
    const { setGraphData, graphData, pending, setPending } = usePassinBizStats()
    const { token } = useAuth()
    const { showToast } = useToast()
    async function handleFetchStats(payload: IPassIssuedStatsRequest) {
        setPending({...pending,'issued':true});

        fetchStats({ ...payload } as IPassIssuedStatsRequest, token).then(res => {
            const normalized = normalizeApiResponse(res);
            const buckets = getBuckets(normalized as IPassIssuedStatsResponse, payload.groupBy)
            const { rows, series } = buildChartData(buckets, payload.groupBy)
            const ranking = computeTotalsByEvent(buckets)
            const dr = normalized?.dateRange ?? (normalized as IPassIssuedStatsResponse)?.dateRange;
            const empty = rows.length === 0 || series.length === 0;
            setGraphData({
                ...graphData,
                ['issued']:{
                    buckets, rows, series, ranking, dr, empty, data: normalized
                }
            })

        }).catch(e => {
            showToast(e?.message, 'error')
        }).finally(() => {
          setPending({...pending,'issued':false});
        })
    }





    return {
        handleFetchStats,   graphData
    }

}